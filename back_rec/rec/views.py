from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Insegnante, OrarioLezioni
from .serializers import InsegnanteSerializer, OrarioLezioniSerializer
from rest_framework import status

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Debug: stampa i dati che arrivano
    print(f"Email: {email}, Password: {password}")

    # Usare la funzione authenticate per trovare l'utente
    user = authenticate(request, username=email, password=password)

    # Verificare se l'utente esiste
    if user is not None:
        # Login successo
        return Response({
            'success': True,
            'user': {
                'id': user.id,
                'nome': user.first_name,
                'cognome': user.last_name,
                'ruolo': user.is_staff  # Per esempio, 'insegnante' o 'studente'
            }
        })
    else:
        # Login fallito
        return Response({'success': False, 'message': 'Credenziali non valide'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_insegnanti(request):
    insegnanti = Insegnante.objects.all()
    serializer = InsegnanteSerializer(insegnanti, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_orario_lezioni(request):
    orario = OrarioLezioni.objects.all()
    serializer = OrarioLezioniSerializer(orario, many=True)
    return Response(serializer.data)