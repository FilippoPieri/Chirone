from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rec.hashers import SHA3512PasswordHasher  # Importa il custom hasher
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Insegnante, Classe, Studente
import logging  # Importa logging
from django.shortcuts import get_object_or_404



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
        
        # Recupera le classi specifiche insegnate dall'insegnante
        classi = insegnante.classi_insegnate.all()
        
        # Crea la lista di classi
        class_list = [
            {
                'id': cls.id,
                'anno': cls.anno,  # Accesso diretto all'attributo
                'sezione': cls.sezione,  # Accesso diretto all'attributo
                'scuola_id': cls.scuola.id,  # Accesso diretto all'attributo tramite relazione ForeignKey
                'scuola_nome': cls.scuola.nome  # Accesso diretto all'attributo tramite relazione ForeignKey
            }
            for cls in classi
        ]
        
        return Response({'classes': class_list})
    
    except Insegnante.DoesNotExist:
        print("Insegnante non trovato per l'utente:", user.username)
        return Response({'error': 'Insegnante non trovato'}, status=404)
    
    except Exception as e:
        print("Errore interno:", str(e))
        # Usa sempre JSON per errori
        return Response({'error': 'Errore interno del server'}, status=500)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_students_by_class(request, class_id):
    classe = get_object_or_404(Classe, id=class_id)
    print ("print riga 110 ","Classe:", classe)
    print("print riga 111 ", "Class ID:", class_id)
    if not request.user.insegnante_profile.classi_insegnate.filter(id=classe.id).exists():
        print("sei a linea 113")
        return Response({'error': 'Non autorizzato'}, status=403)
        
    
    user = request.user
    print("print riga 118 ", "Utente:", user)
    permissions = user.get_all_permissions()
    print("print riga 120 ", "Permessi dell'utente:", permissions)
    


    # Log del token usato per la richiesta (solo per scopi di debugging, non usarlo in produzione)
    token = request.auth  # `request.auth` contiene il token se l'autenticazione è riuscita
    print("print riga 123 ","Token:", token)
    

    # Controlla se l'utente fa parte del gruppo "Insegnante" e ha accesso alla classe
    if not user.groups.filter(name='Insegnante').exists():
        print("sei a linea 131")
        return Response({'error': 'Permesso negato'}, status=403)

    classe = get_object_or_404(Classe, id=class_id)
    print("print riga 136 ","Classe:", classe)
    if not classe.insegnanti_insegnano.filter(id=user.id).exists():
        print("sei a linea 138")
        return Response({'error': 'Accesso non autorizzato a questa classe'}, status=403)

    studenti = classe.studenti.all()
    student_list = [
        {
            'nome': studente.user.first_name,
            'cognome': studente.user.last_name,
            'username': studente.user.username
        }
        for studente in studenti
    ]
    print("print riga 148 ","Studenti:", student_list)

    logger.debug(f"Elenco studenti recuperati: {student_list}")
    print("print riga 151 ")
    return Response({'students': student_list})