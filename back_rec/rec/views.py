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
from .models import Insegnante, Classe, Presenza, Voto, Orario, Materia, Studente
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

#sicura
@api_view(['POST']) #indica che si tratta di una richiesta POST (ricezione dati utente --> db)
@permission_classes([IsAuthenticated]) #verifica che l'utente sia autenticato
def create_voti(request):
    # controlla se i dati inviati sono una lista
    if isinstance(request.data, list):
        # crea una lista per tenere traccia dei dati dei voti salvati
        saved_voti = [] # lista per raccogliere i voti salvati con successo
        errors = [] # raccoglie eventuali errori durante il percorso

        for voto_data in request.data: #ciclo per ogni voto inserito nella lista
            studente_id = voto_data.get('studente')  # recupera l'ID dello studente dal payload
            if not studente_id: #se il voto non ha associato l'id dello studente genera un'errore e passa oltre
                errors.append({"error": "studente è obbligatorio per ogni voto"})
                continue

            # recupera lo studente e risali alla classe
            try:
                studente = Studente.objects.get(id=studente_id) # trova lo studente con l'id fornito
                classe_id = studente.classe.id  # risale alla classe dallo studente
            except Studente.DoesNotExist: # se lo studente non esiste genera un'errore
                errors.append({"error": f"Studente con ID {studente_id} non trovato"})
                continue
            except AttributeError: # se la classe non esiste genera un'errore
                errors.append({"error": f"Studente con ID {studente_id} non è associato a una classe"})
                continue

            # verifica l'associazione dell'insegnante con la classe e se non sono associati genera un'errore
            if not request.user.insegnante_profile.classi_insegnate.filter(id=classe_id).exists():
                errors.append({"error": f"Non autorizzato a creare voti per la classe con ID {classe_id}"})
                continue

            # procedi con la serializzazione e il salvataggio
            serializer = VotoSerializer(data=voto_data) # usa il serializzatore per i voti
            if serializer.is_valid(): # se il voto e' valido lo aggiunge ai voti salvati 
                voto = serializer.save()
                saved_voti.append(serializer.data)
            else: # se i voti non sono validi genera un'errore
                errors.append(serializer.errors)

        if errors:
            # restituisci sia i voti salvati che gli errori, se presenti
            return Response({'success': saved_voti, 'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

        # restituisci solo i voti salvati se tutto è andato a buon fine
        return Response(saved_voti, status=status.HTTP_201_CREATED)
    else:
        # restituisci un errore se i dati inviati non sono una lista
        return Response({"error": "Mi aspettavo una lista di voti ma ho ricevuto un singolo oggetto"}, status=status.HTTP_400_BAD_REQUEST)


#sicura
@api_view(['GET'])  # indica che si tratta di una richiesta GET (ricezione dati db --> utente)
@permission_classes([IsAuthenticated])  # verifica che l'utente sia autenticato
def get_insegnante_materie(request):
    # recupera l'utente autenticato dalla richiesta
    user = request.user
    try:
        print("Utente autenticato:", user.username)  # Debug per verificare l'utente autenticato

        # verifica che l'utente abbia un profilo insegnante
        insegnante = Insegnante.objects.get(user=user) #verifica che l'utente sia un'insegnante
        print("Insegnante trovato:", insegnante)  # debug per conferma

        # recupera le materie associate all'insegnante autenticato
        materie = insegnante.materie.all() # recupera le materie associate all'utente
        print("Materie recuperate:", materie)  # debug per conferma

        # serializza le materie per la risposta formattandola in un JSON
        serializer = MateriaSerializer(materie, many=True, context={'request': request}) # serializza una lista di oggetti --> (mant= ture)

        # restituisce il JSON con le materie dell'insegnante autenticato
        return Response({'materie': serializer.data})

    except Insegnante.DoesNotExist:
        # se l'insegnante non esiste, restituisce un errore
        print(f"L'utente {user.username} non ha un profilo insegnante.")  # Debug
        return Response({'error': 'Insegnante non trovato'}, status=404)

    except Exception as e:
        #gGestisce eventuali errori imprevisti
        print("Errore interno:", str(e))  # debug per errori generali
        return Response({'error': 'Errore interno del server'}, status=500)

#sicuro
@api_view(['GET'])  # Indica che si tratta di una richiesta GET (ricezione dati db --> utente)
@permission_classes([IsAuthenticated])  # Verifica che l'utente sia autenticato
def get_voti_classe_materia_insegnante(request, classe_id):
    user = request.user  # Ottiene l'utente autenticato

    try:
        # recupera l'insegnante loggato
        insegnante = Insegnante.objects.get(user=user)

        # verifica se la classe è associata all'insegnante
        if not insegnante.classi_insegnate.filter(id=classe_id).exists(): # se l'utente non ha la classe, restituisce un errore
            return Response({'error': 'Non autorizzato a visualizzare i voti di questa classe'}, status=403)

        # ottieni tutte le materie insegnate dall'insegnante
        materie_insegnate = insegnante.materie.all()

        # recupera la classe specifica
        classe = get_object_or_404(Classe, id=classe_id)

        # filtra i voti degli studenti di quella classe e delle materie insegnate
        voti = Voto.objects.filter(studente__classe=classe, materia__in=materie_insegnate)

        # serializza i voti
        serializer = VotoSerializer(voti, many=True) 
        return Response(serializer.data, status=200)

    except Insegnante.DoesNotExist: # se l'insegnante non esiste, restituisce un errore
        return Response({'error': 'Insegnante non trovato'}, status=404)
    except Exception as e: # gestisce eventuali errori imprevisti
        return Response({'error': 'Errore interno del server', 'details': str(e)}, status=500)

#sicura  
@api_view(['GET'])  # indica che si tratta di una richiesta GET (ricezione dati db --> utente)
@permission_classes([IsAuthenticated])  # verifica che l'utente sia autenticato
def get_orario_by_classe(request, classe_id):
    try:
        # recupera l'insegnante loggato
        user = request.user
        insegnante = Insegnante.objects.get(user=user)

        # verifica che la classe sia associata all'insegnante
        if not insegnante.classi_insegnate.filter(id=classe_id).exists(): # se l'utente non ha la classe, restituisce un errore
            return Response({'error': 'Non autorizzato a visualizzare l\'orario di questa classe'}, status=403)

        # recupera la classe specifica
        classe = get_object_or_404(Classe, id=classe_id)

        # recupera gli orari della classe
        orari = Orario.objects.filter(classe=classe)

        # serializza gli orari (JSON)
        serializer = OrarioSerializer(orari, many=True)

        # restituisce gli orari della classe (JSON)
        return Response(serializer.data)

    except Insegnante.DoesNotExist: # se l'insegnante non esiste, restituisce un errore
        return Response({'error': 'Insegnante non trovato'}, status=404)
    except Exception as e: # gestisce eventuali errori imprevisti
        return Response({'error': 'Errore interno del server', 'details': str(e)}, status=500)


@api_view(['POST'])  # Indica che si tratta di una richiesta POST (ricezione dati utente --> db)
@permission_classes([IsAuthenticated])  # Verifica che l'utente sia autenticato
def create_orario(request):
    try:
        user = request.user

        # recupera il profilo insegnante
        insegnante = Insegnante.objects.get(user=user)

         # recupera i dati della richiesta
        data = request.data
        if isinstance(data, list):  # controlla se la richiesta contiene una lista
            for orario_data in data: # ciclo per ogni orario nella lista
                classe_id = orario_data.get('classe') # recupera la classe per ogni orario
                if not classe_id: # se non viene fornita la classe, restituisce un errore
                    return Response({'error': 'classe è obbligatorio per ogni orario'}, status=status.HTTP_400_BAD_REQUEST)

                # Controlla se la classe è associata all'insegnante
                if not insegnante.classi_insegnate.filter(id=classe_id).exists(): # se l'utente non è associato all'id della classe restituisce un errore
                    return Response({'error': f"Non autorizzato a creare orari per la classe con ID {classe_id}"}, status=status.HTTP_403_FORBIDDEN)
        else: # se la richiesta non contiene una lista, restituisce un errore
            return Response({'error': 'Mi aspettavo una lista di orari'}, status=status.HTTP_400_BAD_REQUEST)

        # serializza gli orari (JSON)
        serializer = OrarioSerializer(data=data, many=True)
        if serializer.is_valid(): # se i dati sono validi
            serializer.save() # salva i dati
            return Response(serializer.data, status=status.HTTP_201_CREATED) # restituisce i dati salvati
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # se i dati non sono validi

    except Insegnante.DoesNotExist: # se l'insegnante non esiste, restituisce un errore
        return Response({'error': 'Insegnante non trovato'}, status=status.HTTP_404_NOT_FOUND)
    except Materia.DoesNotExist as e: # se la materia non esiste, restituisce un errore
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e: # gestisce eventuali errori imprevisti
        return Response({'error': 'Errore interno del server', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])  # Indica che si tratta di una richiesta GET (ricezione dati db --> utente)
@permission_classes([IsAuthenticated])  # Verifica che l'utente sia autenticato
def get_all_materie(request):
    try:
        # recupera l'utente autenticato
        user = request.user

        # verifica che l'utente sia un insegnante
        insegnante = Insegnante.objects.get(user=user)

        # recupera le classi associate all'insegnante
        classi_collegate = insegnante.classi_insegnate.all()

        # recupera le materie legate alle classi collegate
        materie = Materia.objects.filter(classi__in=classi_collegate).distinct()

        # serializza le materie
        serializer = MateriaSerializer(materie, many=True)

        # restituisce le materie filtrate
        return Response(serializer.data, status=200)

    except Insegnante.DoesNotExist: # se l'insegnante non esiste, restituisce un errore
        return Response({'error': 'Insegnante non trovato'}, status=404)
    except Exception as e: # gestisce eventuali errori imprevisti
        return Response({'error': 'Errore interno del server', 'details': str(e)}, status=500)


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