from django.urls import reverse
from django.contrib.auth.models import User, Group
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.test import TestCase
from rec.models import Insegnante, Materia, Classe, Scuola
from unittest.mock import patch  # Importa patch da unittest.mock

class InsegnanteClassesAPITest(TestCase):
    def setUp(self):
        # Crea il gruppo "Insegnante" se non esiste e aggiungi l'utente
        insegnante_group, created = Group.objects.get_or_create(name='Insegnante')
        self.user = User.objects.create_user(username='lucia@verdi.com', password='Lucia96123')
        self.user.groups.add(insegnante_group)  # Assegna il gruppo "Insegnante" all'utente
        self.insegnante = Insegnante.objects.create(user=self.user)
        
        # Configura il token e l'APIClient per l'autenticazione
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
        # Crea un'istanza di Scuola e Classi
        self.scuola = Scuola.objects.create(nome='Scuola Elementare A')
        self.classe1 = Classe.objects.create(anno=1, sezione='A', scuola=self.scuola)
        self.classe2 = Classe.objects.create(anno=2, sezione='B', scuola=self.scuola)

        # URL per il test
        self.url = reverse('get_insegnante_classes')

        # Associa le materie e le classi all'insegnante
        self.materia = Materia.objects.create(nome='Matematica')
        self.materia.classi.add(self.classe1, self.classe2)
        self.insegnante.materie.add(self.materia)

    def test_get_classes_json_response(self):
        # Simulazione di una richiesta GET all'endpoint
        response = self.client.get(self.url)
        print("Contenuto della risposta:", response.content)
        # Verifica che la risposta sia 200 OK e il formato corretto
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/json')  # Verifica che il Content-Type sia JSON
        
        # Verifica che i dati restituiti siano corretti
        expected_data = {
            'classes': [
                {'anno': 1, 'sezione': 'A', 'scuola_id': self.scuola.id, 'scuola_nome': self.scuola.nome},
                {'anno': 2, 'sezione': 'B', 'scuola_id': self.scuola.id, 'scuola_nome': self.scuola.nome}
            ]
        }
        self.assertEqual(response.json(), expected_data)

    def test_insegnante_not_found(self):
        # Testa il caso di insegnante non trovato dopo aver rimosso l'insegnante.
        self.insegnante.delete()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json(), {'error': 'Insegnante non trovato'})
    def test_internal_server_error(self):
        # Simula un errore inaspettato
        with patch('rec.views.Insegnante.objects.get') as mock_get:
            mock_get.side_effect = Exception("Errore simulato")

            response = self.client.get(self.url)
            
            # Verifica che la risposta sia 500 Internal Server Error
            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
            self.assertEqual(response.json(), {'error': 'Errore interno del server'})