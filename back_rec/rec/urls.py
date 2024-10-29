from django.urls import path
from .views import LoginAPIView

urlpatterns = [
    path("api/login/", LoginAPIView.as_view(), name="api_login"),  # Rotta per l'API di login
    # Puoi aggiungere altre rotte API per altre funzionalità se necessario
]