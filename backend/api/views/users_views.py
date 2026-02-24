import sys

import django.core.mail
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Check if email and password are provided
        if "email" not in attrs or "password" not in attrs:
            raise ValidationError(
                {"message": "Email and password are required"}
            )

        # First try to get the user to check if they're verified
        try:
            user = User.objects.get(email=attrs.get("email"))
            if not user.verified:
                raise AuthenticationFailed(
                    {"message": "Email is not verified"}
                )
        except User.DoesNotExist:
            pass  # Will be handled by parent validation

        # Call parent validation which checks credentials
        try:
            data = super().validate(attrs)
        except AuthenticationFailed:
            raise AuthenticationFailed(
                {"message": "Invalid email or password"}
            )

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token["name"] = user.name
        token["email"] = user.email
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Handle missing fields before serializer validation
        if "email" not in request.data or "password" not in request.data:
            return Response(
                {"message": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            return super().post(request, *args, **kwargs)
        except ValidationError as e:
            # Handle validation errors with custom message format
            if hasattr(e, "detail") and isinstance(e.detail, dict):
                if "message" in e.detail:
                    return Response(
                        e.detail, status=status.HTTP_400_BAD_REQUEST
                    )
            return Response(
                {"message": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except AuthenticationFailed as e:
            # Handle authentication errors with custom message format
            if hasattr(e, "detail") and isinstance(e.detail, dict):
                if "message" in e.detail:
                    return Response(
                        e.detail, status=status.HTTP_401_UNAUTHORIZED
                    )
            return Response(
                {"message": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


@api_view(["POST"])
def register_user(request):
    message = {"message": "User could not be registered"}
    if (
        "email" not in request.data
        or "password" not in request.data
        or "name" not in request.data
    ):
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

    try:
        email = request.data["email"]
        password = request.data["password"]
        name = request.data["name"]

        if len(password) < 8:
            message["message"] = "Password must be at least 8 characters long"
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        if (
            email.count("@") != 1
            or email.startswith("@")
            or email.endswith("@")
        ):
            message["message"] = "Invalid email format"
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        # Additional validation for email format can be added here

        user = User.objects.create_user(
            email=email, password=password, name=name
        )
        user.save()
    # existence of user with same email is handled by unique constraint
    #  on email field, which will raise an IntegrityError
    except IntegrityError:
        message["message"] = "User with this email already exists"
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except Exception:
        message["message"] = "An error occurred during registration"
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Send verification email
        subject = settings.EMAIL_SUBJECT_PREFIX + "Welcome to our platform!"
        message = f"Hello {user.name}, welcome to our platform!"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]

        django.core.mail.send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
        )
        user.verification_email_sent = True
        user.save()
    except Exception as e:
        # Log the error but do not fail the registration process
        print(f"Error sending verification email: {e}")
        print(sys.exc_info())

    return Response(
        {"message": "User registered successfully"},
        status=status.HTTP_201_CREATED,
    )
