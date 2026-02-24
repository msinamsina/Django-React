from unittest.mock import patch

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient


@patch("api.views.users_views.send_mail")
class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_model = get_user_model()

    def test_create_user(self, mock_send_mail):
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpass123",
        }
        response = self.client.post("/api/users/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = self.user_model.objects.get(email=payload["email"])
        self.assertTrue(user.check_password(payload["password"]))

    def test_register_user_has_correct_fields(self, mock_send_mail):
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpass123",
        }
        response = self.client.post("/api/users/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = self.user_model.objects.get(email=payload["email"])
        self.assertEqual(user.name, payload["name"])
        self.assertEqual(user.email, payload["email"])
        self.assertTrue(user.check_password(payload["password"]))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.verified)
        self.assertTrue(user.is_active)

    def test_create_user_with_bad_email(self, mock_send_mail):
        payload = {
            "name": "Test User",
            "email": "invalid-email",
            "password": "testpass123",
        }
        response = self.client.post("/api/users/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_short_password(self, mock_send_mail):
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "short",
        }
        response = self.client.post("/api/users/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_no_name(self, mock_send_mail):
        payload = {"email": "test@example.com", "password": "testpass123"}
        response = self.client.post("/api/users/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_existing_user_registration(self, mock_send_mail):
        self.user_model.objects.create_user(
            name="Existing User",
            email="existing@example.com",
            password="existingpass123",
        )
        payload = {
            "name": "Test User",
            "email": "existing@example.com",
            "password": "testpass123",
        }
        response = self.client.post("/api/users/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("message", response.data)
        self.assertEqual(
            response.data["message"], "User with this email already exists"
        )

    def test_email_sending_on_registration(self, mock_send_mail):
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpass123",
        }
        response = self.client.post("/api/users/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_send_mail.assert_called_once_with(
            subject=settings.EMAIL_SUBJECT_PREFIX + "Welcome to our platform!",
            message=f"Hello {payload['name']}, welcome to our platform!",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[payload["email"]],
        )


class UserAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_model = get_user_model()
        self.user = self.user_model.objects.create_user(
            name="Test User",
            email="test@example.com",
            password="test@pass123",
        )
        self.user.verified = True
        self.user.save()

    def test_login_user(self):
        payload = {"email": "test@example.com", "password": "test@pass123"}
        response = self.client.post("/api/users/token/", payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        token = response.data["access"]
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        self.assertEqual(decoded_token["user_id"], str(self.user.id))
        self.assertEqual(decoded_token["email"], self.user.email)
        self.assertEqual(decoded_token["name"], self.user.name)

    def test_login_user_with_invalid_credentials(self):
        payload = {"email": "invalid@example.com", "password": "wrongpassword"}
        response = self.client.post("/api/users/token/", payload)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Invalid email or password")

    def test_login_user_with_missing_fields(self):
        payload = {"email": "test@example.com"}
        response = self.client.post("/api/users/token/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Email and password are required")

        payload = {"password": "test@pass123"}
        response = self.client.post("/api/users/token/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Email and password are required")

    def test_login_user_with_unverified_email(self):
        self.user_model.objects.create_user(
            name="Unverified User",
            email="unverified@example.com",
            password="unverifiedpass123",
            verified=False,
        )
        payload = {"email": "unverified@example.com", "password": "unverifiedpass123"}
        response = self.client.post("/api/users/token/", payload)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Email is not verified")
