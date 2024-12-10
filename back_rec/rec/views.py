from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.status import HTTP_403_FORBIDDEN
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Max
from .models import Insegnante, Classe, Presenza, Voto, Orario, Materia
from .serializers import ClasseSerializer, StudenteSerializer, PresenzaSerializer, VotoSerializer, MateriaSerializer, VotoSerializer, OrarioSerializer
from .serializers import MateriaSerializer


class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Usa `authenticate` per verificare le credenziali dell'utente
        user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
        if user is not None:
            # Crea un token JWT per l'utente
            refresh = RefreshToken.for_user(user)

            # Aggiungi tutti i campi richiesti dal frontend
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'id': user.id,
                'nome': user.first_name,  # Assicurati che il campo 'first_name' sia compilato per l'utente
                'cognome': user.last_name,  # Assicurati che il campo 'last_name' sia compilato per l'utente
                'role': 'insegnante' if user.groups.filter(name='Insegnante').exists() else 'studente'  # o altro ruolo
            }, status=status.HTTP_200_OK)
        else:
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
    # Recupera la classe usando il class_id e gestisce il caso in cui l'oggetto non esista
    classe = get_object_or_404(Classe, id=class_id)
    
    # Verifica se l'utente è autorizzato a insegnare in quella classe
    if not request.user.insegnante_profile.classi_insegnate.filter(id=classe.id).exists():
        return Response({'error': 'Non autorizzato'}, status=HTTP_403_FORBIDDEN)

    # Verifica se l'utente fa parte del gruppo "Insegnante" e ha accesso alla classe
    if not request.user.groups.filter(name='Insegnante').exists():
        return Response({'error': 'Permesso negato'}, status=HTTP_403_FORBIDDEN)

    # Recupera tutti gli studenti della classe
    studenti = classe.studenti.all()

    # Usa il serializer per serializzare i dati degli studenti
    serializer = StudenteSerializer(studenti, many=True)
    
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
def get_presenze_oggi(request, classe_id=None):
    # Ottieni la data corrente
    oggi = timezone.now().date()
    
    # Inizia con una query base che filtra le presenze per la data corrente
    query = Presenza.objects.filter(data=oggi)

    # Se un classe_id è fornito, aggiungi un filtro per classe
    if classe_id:
        query = query.filter(classe_id=classe_id)

    # Trova l'ID dell'ultima presenza per ogni studente nella data corrente
    ultime_presenze_ids = (
        query.values('studente')
        .annotate(max_id=Max('id'))
        .values_list('max_id', flat=True)
    )

    # Recupera i record con gli ID trovati
    ultime_presenze = Presenza.objects.filter(id__in=ultime_presenze_ids)

    # Serializza i dati
    serializer = PresenzaSerializer(ultime_presenze, many=True)
    
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
    # Filtra solo le assenze dello studente loggato
    assenze = studente.presenze.filter(stato='assente')  # Supponendo che "stato" indichi presenza/assenza
    serializer = PresenzaSerializer(assenze, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orario_studente(request):
    studente = request.user.studente_profile  # Ottieni il profilo dello studente loggato
    classe = studente.classe  # Ottieni la classe dello studente
    orari = classe.orari.all()  # Recupera tutti gli orari della classe
    serializer = OrarioSerializer(orari, many=True)
    return Response(serializer.data)