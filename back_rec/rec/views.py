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

#sicura
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
#sicura
@api_view(['GET'])  # indicha che si tratta di una richiesta GET (ricezione dati db --> utente)
@permission_classes([IsAuthenticated])  # verifica che l'utente sia autenticato
def get_insegnante_classes(request):
    user = request.user  # ottiene l'utente autenticato dalla richiesta
    print("Utente autenticato:", user.username)  # stampa il nome utente per il logging

    # verifica se l'utente appartiene al gruppo "Insegnante"
    if not user.groups.filter(name='Insegnante').exists():
        # se l'utente non è un insegnante, ritorna un errore 403 che nega l'accesso all'utente non associato al gruppo
        return Response({'error': 'Permesso negato'}, status=403)

    try:
        # tenta di ottenere l'oggetto Insegnante associato all'utente
        insegnante = Insegnante.objects.get(user=user)
        print("Insegnante trovato:", insegnante.user.username)  # log dell'insegnante trovato

        # recupera le classi insegnate dall'insegnante tramite la relazione classi_insegnate
        classi = insegnante.classi_insegnate.all()

        # usa il serializzatore delle classi per la risposta formattandoli in un json
        serializer = ClasseSerializer(classi, many=True)
        return Response({'classes': serializer.data})  # Ritorna i dati serializzati delle classi

    except Insegnante.DoesNotExist:
        # cerca l'utente associato all'insegnante e se non esiste un insegnante associato, ritorna un errore 404
        print("Insegnante non trovato per l'utente:", user.username)
        return Response({'error': 'Insegnante non trovato'}, status=404)

    except Exception as e:
        # cattura altre eccezioni generiche e ritorna un errore interno 500
        print("Errore interno:", str(e))
        return Response({'error': 'Errore interno del server'}, status=500)

#sicura
@api_view(['GET']) # indicha che si tratta di una richiesta GET (ricezione dati db --> utente)
@permission_classes([IsAuthenticated]) # verifica che l'utente sia autenticato 
def get_students_by_class(request, class_id):
    # recupera la classe utilizzando l'ID fornito. Se la classe non esiste, restituisce un errore 404.
    classe = get_object_or_404(Classe, id=class_id)
    
    # verifica se l'insegnante associato alla richiesta è autorizzato a interagire con la classe indicata.
    if not request.user.insegnante_profile.classi_insegnate.filter(id=classe.id).exists():
        # se l'insegnante non è autorizzato a insegnare in quella classe, restituisce un errore 403 impedendo l'accesso a classi non associate
        return Response({'error': 'Non autorizzato'}, status=HTTP_403_FORBIDDEN)

    # verifica se l'utente fa parte del gruppo "Insegnante" e ha accesso alla classe
    if not request.user.groups.filter(name='Insegnante').exists():
        # se non appartiene al gruppo restituisce un'errore 403
        return Response({'error': 'Permesso negato'}, status=HTTP_403_FORBIDDEN)

    # recupera tutti gli studenti della classe
    studenti = classe.studenti.all()

    # usa il serializer per serializzare i dati degli studenti formattandoli in un formato adatto alla richiesta
    serializer = StudenteSerializer(studenti, many=True)
    
    # ritorna la risposta con i dati serializzati in formato json
    return Response({'students': serializer.data})

#sicura
@api_view(['POST']) #indica che si tratta di una richiesta POST (ricezione dati utente --> db)
@permission_classes([IsAuthenticated]) # verifica che l'utente sia autenticato
def create_presenza(request):
    user = request.user # ottiene l'utente corrispondente all'autenticazione dalla richiesta
    print("Dati ricevuti dal frontend:", request.data) # stampa i dati ricevuti dell'utente, debug

    presenze_data = request.data.get('presenze', []) # inserisce i dati ricevuti in una lista, se non ci sono dati, ritorna una lista vuota
    #se non è una lista ritorna un errore 404 indicante un formato non valido per i dati
    if not isinstance(presenze_data, list):
        return Response({"error": "Il formato dei dati di presenza è invalido. Deve essere una lista."}, status=status.HTTP_400_BAD_REQUEST)

    created_presenze = [] # lista per tenere traccia dei dati di presenza della classe creati
    errors = [] # lista per tenere traccia degli errori creatisi durante il percorso

    # Itera su ogni elemento della lista delle presenze.
    for presenza_data in presenze_data:
        classe_id = presenza_data.get('classe_id') # recupera l'id della classe per acisacun record di presenza
        # Verifica se l'insegnante è autorizzato a presenza per la classe specificata
        if not user.insegnante_profile.classi_insegnate.filter(id=classe_id).exists():
            errors.append({"error": f"Non autorizzato a registrare presenze per la classe {classe_id}"})# errore restituito in caso l'insegnante non sia autorizzato
            continue
        
        #utilizza il serializer per validare i dati della presenza
        serializer = PresenzaSerializer(data=presenza_data)
        #se i dati sono validi li salva nel db e aggiunge i dati alla lista created_presenze
        if serializer.is_valid():
            serializer.save()
            created_presenze.append(serializer.data)
        # Se non sono validi, aggiunge gli errori del serializer alla lista errors
        else:
            print("Errori nel serializer:", serializer.errors)
            errors.append(serializer.errors)
    # se nella lista errors ci sono errori, ritorna un errore 400 e i dettagli dell'errore
    if errors:
        return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
    # se non ci sono errori, restituisce una risposta con status 201 Created e i dettagli delle presenze create.
    return Response({"created_presenze": created_presenze}, status=status.HTTP_201_CREATED)

#sicuro
@api_view(['GET'])  # indicha che si tratta di una richiesta GET (ricezione dati db --> utente)
@permission_classes([IsAuthenticated])  # verifica che l'utente sia autenticato
def get_presenze_oggi(request, classe_id=None):
    user = request.user  # ottiene l'utente autenticato.
    oggi = timezone.now().date()  # Recupera la data corrente.

    if not classe_id:
        # se non viene fornito un id per la classe, restituisce un errore.
        return Response({'error': 'È necessario specificare un ID di classe.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # recupera la classe utilizzando l'ID fornito o restituisce un errore 404 se non trovata.
    classe = get_object_or_404(Classe, id=classe_id)
    
    # verifica che l'insegnante sia autorizzato ad accedere alle presenze di questa classe.
    if not user.insegnante_profile.classi_insegnate.filter(id=classe.id).exists():
        return Response({'error': 'Non autorizzato a visualizzare le presenze di questa classe.'}, status=status.HTTP_403_FORBIDDEN)

    # filtra le presenze per la classe e la data corrente.
    query = Presenza.objects.filter(data=oggi, classe=classe)
    
    # ottiene gli ID delle ultime presenze di ogni studente nella classe per la data corrente.
    ultime_presenze_ids = (
        query.values('studente')
        .annotate(max_id=Max('id'))
        .values_list('max_id', flat=True)
    )
    
    # recupera i record delle presenze corrispondenti agli ID trovati.
    ultime_presenze = Presenza.objects.filter(id__in=ultime_presenze_ids)
    
    # serializza i dati delle presenze.
    serializer = PresenzaSerializer(ultime_presenze, many=True)
    
    # restituisce i dati serializzati.
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