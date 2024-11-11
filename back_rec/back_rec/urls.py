from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # Rotta per l’admin
    path('', include('rec.urls')),  # Includiamo le rotte di rec
]
