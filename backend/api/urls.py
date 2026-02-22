from django.urls import path
from .views.users_views import register_user

urlpatterns = [
    path('users/register/', register_user, name='register_user'),
]