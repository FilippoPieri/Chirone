from django.urls import path
from .views import CustomLoginView
from .views import get_insegnante_classes, get_students_by_class

urlpatterns = [
    path("api/login/", CustomLoginView.as_view(), name="api_login"),
    path('api/insegnante/classes/', get_insegnante_classes, name='get_insegnante_classes'),
    path('api/classes/<int:class_id>/students/', get_students_by_class, name='get_students_by_class'),
]