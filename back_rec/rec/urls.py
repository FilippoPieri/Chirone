from django.urls import path
from .views import LoginAPIView
from .views import get_insegnante_classes, get_students_by_class, create_presenza, get_presenze_oggi, create_voti
from .views import get_insegnante_materie, get_voti_classe_materia_insegnante, get_orario_by_classe, create_orario, get_all_materie
from .views import get_voti_studente, get_presenze_studente, get_orario_studente
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Rinnovo token
    path('api/login/', LoginAPIView.as_view(), name='api_login'),
    path('api/insegnante/classes/', get_insegnante_classes, name='get_insegnante_classes'),
    path('api/classes/<int:class_id>/students/', get_students_by_class, name='get_students_by_class'),
    path('api/presenze/', create_presenza, name='create_presenza'),  # Modificato con 'presenze'
    path('api/presenze/oggi/classe/<int:classe_id>/', get_presenze_oggi, name='get_presenze_per_classe_oggi'),
    path('api/voto/', create_voti, name='create_voto'),
    path('api/insegnante/materie/', get_insegnante_materie, name='get_insegnante_materie'),  # Nuova rotta per le materie dell'insegnante
    path('api/insegnante/classe/<int:classe_id>/voti/', get_voti_classe_materia_insegnante, name='get_voti_classe_materia_insegnante'),
    path('api/orario/<int:classe_id>/', get_orario_by_classe, name='get_orario_by_classe'),
    path('api/orario/', create_orario, name='create_orario'),
    path('api/materie/', get_all_materie, name='get_all_materie'),  # Nuovo endpoint per tutte le materie
    path('api/voti-studente/', get_voti_studente, name='get_voti_studente'),
    path('api/presenze-studente/', get_presenze_studente, name='get_presenze_studente'),
    path('api/orario-studente/', get_orario_studente, name='get_orario_studente'),
]