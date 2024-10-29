from django.urls import path
from .views import CustomLoginView  # Importa la tua vista personalizzata

urlpatterns = [
    path("api/login/", CustomLoginView.as_view(), name="api_login"),
]