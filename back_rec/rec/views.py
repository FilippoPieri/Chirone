from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rec.hashers import SHA3512PasswordHasher  # Importa il custom hasher
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import Insegnante
import logging  # Importa logging
from rest_framework.views import exception_handler


# Configura il logger
logger = logging.getLogger(__name__)

class CustomLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        # Recupera l'utente ignorando il case dell'username
        user = User.objects.filter(username__iexact=username).first()
        if user:
            # Recupera l'hash della password dal database
            db_password_hash = user.password
            
            # Usa il custom hasher per generare l'hash della password inviata
            hasher = SHA3512PasswordHasher()
            salt = db_password_hash.split('$')[1]  # Estrai il salt dall'hash salvato
            generated_hash = hasher.encode(password, salt)

            print("Generated Hash:", generated_hash)  # Debug
            print("DB Password Hash:", db_password_hash)  # Debug
            
            # Confronto tra l'hash generato e quello nel database
            if generated_hash == db_password_hash:
                print("Autenticazione riuscita per:", username)  # Debug
                # Se l'autenticazione è riuscita, genera o recupera il token dell'utente
                token, created = Token.objects.get_or_create(user=user)

                # Determina il ruolo dell'utente
                # Determina il ruolo dall'appartenenza ai gruppi
                if user.groups.filter(name='Insegnante').exists():
                    role = 'insegnante'
                elif user.groups.filter(name='Studente').exists():
                    role = 'studente'
                else:
                    role = 'nessun ruolo definito'  # o gestisci come preferisci
                
                return Response({
                    "token": token.key, 
                    "id": user.id, 
                    "role": role, 
                    "nome": user.first_name,  # Aggiungi il nome
                    "cognome": user.last_name  # Aggiungi il cognome
                }, status=status.HTTP_200_OK)
            else:
                print("Autenticazione fallita, hash non corrispondente")  # Debug

        # Risposta di errore per credenziali non valide
        return Response({"error": "Credenziali non valide"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_insegnante_classes(request):
    user = request.user
    print("Utente autenticato:", user.username)

    # Controlla se l'utente fa parte del gruppo "Insegnante"
    if not user.groups.filter(name='Insegnante').exists():
        return Response({'error': 'Permesso negato'}, status=403)

    try:
        insegnante = Insegnante.objects.get(user=user)
        print("Insegnante trovato:", insegnante.user.username)
        
        # Ottieni le classi
        classes = insegnante.materie.values(
            'classi__anno', 'classi__sezione', 'classi__scuola__id', 'classi__scuola__nome'
        ).distinct()
        
        # Crea la lista di classi
        class_list = [
            {
                'anno': cls['classi__anno'],
                'sezione': cls['classi__sezione'],
                'scuola_id': cls['classi__scuola__id'],
                'scuola_nome': cls['classi__scuola__nome']
            }
            for cls in classes
        ]
        
        return Response({'classes': class_list})
    
    except Insegnante.DoesNotExist:
        print("Insegnante non trovato per l'utente:", user.username)
        return Response({'error': 'Insegnante non trovato'}, status=404)
    
    except Exception as e:
        print("Errore interno:", str(e))
        # Usa sempre JSON per errori
        return Response({'error': 'Errore interno del server'}, status=500)