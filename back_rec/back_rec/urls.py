from django.contrib import admin
from django.urls import path
from rec.views import login_view
from rec.views import get_insegnanti
from rec.views import get_orario_lezioni


urlpatterns = [
    path('api/login/', login_view, name='login'),
    path('admin/', admin.site.urls),  # Aggiungi questa linea per l'admin
    path('api/insegnanti/', get_insegnanti, name='get_insegnanti'),
    path('api/orario/', get_orario_lezioni, name='get_orario_lezioni'),
]