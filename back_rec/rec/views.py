from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rec.hashers import SHA3512PasswordHasher  # Importa il custom hasher
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Insegnante

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

@login_required
def get_insegnante_classes(request):
    user = request.user
    try:
        insegnante = Insegnante.objects.get(user=user)
        classes = insegnante.materie.values_list('classi__anno', 'classi__sezione').distinct()
        class_list = [{'anno': cls[0], 'sezione': cls[1]} for cls in classes]
        return JsonResponse({'classes': class_list}, safe=False)
    except Insegnante.DoesNotExist:
        return JsonResponse({'error': 'Insegnante non trovato'}, status=404)