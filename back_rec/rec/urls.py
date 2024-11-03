from django.urls import path
from .views import CustomLoginView
from .views import get_insegnante_classes

urlpatterns = [
    path("api/login/", CustomLoginView.as_view(), name="api_login"),
    path('api/insegnante/classes/', get_insegnante_classes, name='get_insegnante_classes'),
]