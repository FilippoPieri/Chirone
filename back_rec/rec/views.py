
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.status import HTTP_403_FORBIDDEN
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rec.hashers import SHA3512PasswordHasher  # Importa il custom hasher
import logging  # Importa logging
from .models import Insegnante, Classe, Presenza, Voto, Orario, Materia
from .serializers import AuthTokenSerializer, ClasseSerializer, StudenteSerializer, PresenzaSerializer, VotoSerializer, MateriaSerializer, VotoSerializer, OrarioSerializer
from .serializers import MateriaSerializer


# Configura il logger
logger = logging.getLogger(__name__)

class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = AuthTokenSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)  # Genera o recupera un token per l'utente

            # Aggiungi tutti i campi richiesti dal frontend
            return Response({
                'token': token.key,
                'id': user.id,
                'nome': user.first_name,  # Assicurati che il campo 'first_name' sia compilato per l'utente
                'cognome': user.last_name,  # Assicurati che il campo 'last_name' sia compilato per l'utente
                'role': 'insegnante' if user.groups.filter(name='Insegnante').exists() else 'studente'  # o altro ruolo
            }, status=status.HTTP_200_OK)
        
        # Risposta in caso di errore di autenticazione
        return Response({'error': 'Credenziali non valide'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_insegnante_classes(request):
    user = request.user
    print("Utente autenticato:", user.username)

    # Verifica se l'utente appartiene al gruppo "Insegnante"
    if not user.groups.filter(name='Insegnante').exists():
        return Response({'error': 'Permesso negato'}, status=403)

    try:
        insegnante = Insegnante.objects.get(user=user)
        print("Insegnante trovato:", insegnante.user.username)

        # Recupera le classi insegnate dall'insegnante
        classi = insegnante.classi_insegnate.all()

        # Usa il serializer per serializzare le classi
        serializer = ClasseSerializer(classi, many=True)
        return Response({'classes': serializer.data})

    except Insegnante.DoesNotExist:
        print("Insegnante non trovato per l'utente:", user.username)
        return Response({'error': 'Insegnante non trovato'}, status=404)

    except Exception as e:
        print("Errore interno:", str(e))
        return Response({'error': 'Errore interno del server'}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_students_by_class(request, class_id):
    logger.debug("Inizio elaborazione richiesta per la classe ID: %s", class_id)

    # Recupera la classe usando il class_id e gestisce il caso in cui l'oggetto non esista
    classe = get_object_or_404(Classe, id=class_id)
    logger.debug("Classe recuperata: %s, ID: %s", classe, class_id)

    # Verifica se l'utente è autorizzato a insegnare in quella classe
    if not request.user.insegnante_profile.classi_insegnate.filter(id=classe.id).exists():
        logger.error("Accesso negato: l'utente %s non insegna alla classe ID %s", request.user.username, class_id)
        return Response({'error': 'Non autorizzato'}, status=HTTP_403_FORBIDDEN)

    # Verifica se l'utente fa parte del gruppo "Insegnante" e ha accesso alla classe
    if not request.user.groups.filter(name='Insegnante').exists():
        logger.error("Permesso negato: l'utente %s non appartiene al gruppo 'Insegnante'", request.user.username)
        return Response({'error': 'Permesso negato'}, status=HTTP_403_FORBIDDEN)

    # Recupera tutti gli studenti della classe
    studenti = classe.studenti.all()

    # Usa il serializer per serializzare i dati degli studenti
    serializer = StudenteSerializer(studenti, many=True)
    logger.info("Elenco studenti preparato per la classe ID %s: %s", class_id, serializer.data)
    
    return Response({'students': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_presenza(request):

    print("Dati ricevuti dal frontend:", request.data)  # Logga i dati ricevuti

    presenze_data = request.data.get('presenze', [])  # Ottieni la lista di presenze dal payload

    # Controlla che il payload sia una lista
    if not isinstance(presenze_data, list):
        return Response({"error": "Il formato dei dati di presenza è invalido. Deve essere una lista."}, status=status.HTTP_400_BAD_REQUEST)

    # Cicla attraverso le presenze e serializzale una ad una
    created_presenze = []
    errors = []

    for presenza_data in presenze_data:
        serializer = PresenzaSerializer(data=presenza_data)
        if serializer.is_valid():
            serializer.save()
            created_presenze.append(serializer.data)  # Aggiungi la presenza valida alla lista
        else:
            print("Errori nel serializer:", serializer.errors)  # Log degli errori
            errors.append(serializer.errors)  # Aggiungi errori se la presenza non è valida

    # Verifica se ci sono errori
    if errors:
        return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"created_presenze": created_presenze}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_presenze_oggi(request):
    # Ottieni la data corrente
    oggi = timezone.now().date()
    
    # Filtra le presenze per il giorno corrente
    presenze_oggi = Presenza.objects.filter(data=oggi)
    
    # Serializza i dati
    serializer = PresenzaSerializer(presenze_oggi, many=True)
    
    # Restituisci la risposta
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_voti(request):
    # Controlla se i dati inviati sono una lista
    if isinstance(request.data, list):
        # Crea una lista per tenere traccia dei dati dei voti salvati
        saved_voti = []
        errors = []
        for voto_data in request.data:
            serializer = VotoSerializer(data=voto_data)
            if serializer.is_valid():
                voto = serializer.save()
                saved_voti.append(serializer.data)
            else:
                errors.append(serializer.errors)
        
        if errors:
            return Response({'success': saved_voti, 'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response(saved_voti, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": "Mi aspettavo una lista di voti ma ho ricevuto un singolo oggetto"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_insegnante_materie(request):
    user = request.user
    try:
        print("Utente autenticato:", user.username)  # Debug
        insegnante = Insegnante.objects.get(user=user)
        print("Insegnante trovato:", insegnante)  # Debug

        materie = insegnante.materie.all()
        print("Materie recuperate:", materie)  # Debug

        # Passa il contesto della richiesta al serializer
        serializer = MateriaSerializer(materie, many=True, context={'request': request})
        return Response({'materie': serializer.data})
    except Insegnante.DoesNotExist:
        return Response({'error': 'Insegnante non trovato'}, status=404)
    except Exception as e:
        print("Errore interno:", str(e))  # Debug per altri errori
        return Response({'error': 'Errore interno del server'}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_voti_classe_materia_insegnante(request, classe_id):
    user = request.user
    
    try:
        # Recupera l'insegnante loggato
        insegnante = Insegnante.objects.get(user=user)

        # Ottieni tutte le materie insegnate dall'insegnante
        materie_insegnate = insegnante.materie.all()

        # Recupera la classe specifica
        classe = get_object_or_404(Classe, id=classe_id)

        # Filtra i voti degli studenti di quella classe e delle materie insegnate
        voti = Voto.objects.filter(studente__classe=classe, materia__in=materie_insegnate)

        # Serializza i voti
        serializer = VotoSerializer(voti, many=True)
        return Response(serializer.data, status=200)

    except Insegnante.DoesNotExist:
        return Response({'error': 'Insegnante non trovato'}, status=404)
    except Exception as e:
        return Response({'error': 'Errore interno del server', 'details': str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orario_by_classe(request, classe_id):
    classe = get_object_or_404(Classe, id=classe_id)
    orari = Orario.objects.filter(classe=classe)
    serializer = OrarioSerializer(orari, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_orario(request):
    try:
        serializer = OrarioSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Materia.DoesNotExist as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # Log error here if needed
        return Response({'error': 'Server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Facoltativo: se vuoi richiedere l'autenticazione
def get_all_materie(request):
    materie = Materia.objects.all()
    serializer = MateriaSerializer(materie, many=True)
    return Response(serializer.data)

#-----------------------------------------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_voti_studente(request):
    studente = request.user.studente_profile  # Ottieni il profilo studente associato all'utente loggato
    voti = studente.voti.all()  # Recupera tutti i voti dello studente
    serializer = VotoSerializer(voti, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_presenze_studente(request):
    studente = request.user.studente_profile  # Associa l'utente loggato al profilo studente
    presenze = studente.presenze.all()  # Recupera tutte le presenze dello studente
    serializer = PresenzaSerializer(presenze, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orario_studente(request):
    studente = request.user.studente_profile  # Ottieni il profilo dello studente loggato
    classe = studente.classe  # Ottieni la classe dello studente
    orari = classe.orari.all()  # Recupera tutti gli orari della classe
    serializer = OrarioSerializer(orari, many=True)
    return Response(serializer.data)