from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("api/login/", obtain_auth_token, name="api_login"),
    # Puoi aggiungere altre rotte API per altre funzionalità se necessario
]