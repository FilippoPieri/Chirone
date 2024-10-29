from django.contrib import admin
from .models import Scuola, Classe, Studente, Insegnante, Materia, Voto, Presenza, Orario  # Importa i tuoi modelli

# Registra il modello per l'amministrazione
admin.site.register(Scuola)
admin.site.register(Classe)
admin.site.register(Studente)
admin.site.register(Insegnante)
admin.site.register(Materia)
admin.site.register(Voto)
admin.site.register(Presenza)
admin.site.register(Orario)


