from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.core.mail import send_mail
from django.conf import settings
import sys

User = get_user_model()

@api_view(['POST'])
def register_user(request):
    message = {"message": "User could not be registered"}
    if 'email' not in request.data or 'password' not in request.data or 'name' not in request.data:
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

    try:
        email = request.data['email']
        password = request.data['password']
        name = request.data['name']

        if len(password) < 8:
            message["message"] = "Password must be at least 8 characters long"
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        if email.count('@') != 1 or email.startswith('@') or email.endswith('@'):
            message["message"] = "Invalid email format"
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        # Additional validation for email format can be added here

        user = User.objects.create_user(email=email, password=password, name=name)
        user.save()
    # existence of user with same email is handled by unique constraint on email field, which will raise an IntegrityError
    except IntegrityError:
        message["message"] = "User with this email already exists"
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message["message"] = "An error occurred during registration"
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Send verification email
        subject=settings.EMAIL_SUBJECT_PREFIX + 'Welcome to our platform!'
        message=f'Hello {user.name}, welcome to our platform!'
        from_email=settings.DEFAULT_FROM_EMAIL
        recipient_list=[user.email]
        
        send_mail(
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

    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)