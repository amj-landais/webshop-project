from django.urls import path

from account.api.views import RegisterUserAPI, PasswordAPI
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('v1/register/', RegisterUserAPI.as_view()),
    path('v1/login/', obtain_auth_token),
    path('v1/passchange/', PasswordAPI.as_view()),
]