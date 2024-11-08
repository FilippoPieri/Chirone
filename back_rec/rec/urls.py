from django.urls import path
from .views import LoginAPIView
from .views import get_insegnante_classes, get_students_by_class, create_presenza, get_presenze_oggi, create_voti

urlpatterns = [
    path('api/login/', LoginAPIView.as_view(), name='api_login'),
    path('api/insegnante/classes/', get_insegnante_classes, name='get_insegnante_classes'),
    path('api/classes/<int:class_id>/students/', get_students_by_class, name='get_students_by_class'),
    path('api/presenze/', create_presenza, name='create_presenza'),  # Modificato con 'presenze'
    path('api/presenze/oggi/', get_presenze_oggi, name='get_presenze_oggi'),
    path('api/voto/', create_voti, name='create_voto'),
]