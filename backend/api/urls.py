from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views.users_views import CustomTokenObtainPairView, register_user

urlpatterns = [
    path("users/register/", register_user, name="register_user"),
    path("users/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("users/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
