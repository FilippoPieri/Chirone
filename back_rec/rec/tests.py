'''from django.urls import reverse
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
'''

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User, Group
from rest_framework.authtoken.models import Token
from unittest.mock import patch
from .models import Insegnante, Classe, Studente, Scuola

class StudentiByClassAPITest(TestCase):
    def setUp(self):
        # Setup comune eseguito prima di ciascun test
        self.insegnante_group, _ = Group.objects.get_or_create(name='Insegnante')
        self.user = User.objects.create_user(username='lucia@verdi.com', password='Lucia96123')
        self.user.groups.add(self.insegnante_group)
        self.insegnante = Insegnante.objects.create(user=self.user)
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.scuola = Scuola.objects.create(nome="Liceo Scientifico")
        self.classe = Classe.objects.create(anno=5, sezione='A', scuola=self.scuola)
        self.classe.insegnanti_insegnano.add(self.insegnante)
        self.url = reverse('get_students_by_class', kwargs={'class_id': self.classe.id})

    def test_get_students_by_class(self):
        print("Testing access for instructor...")
        response = self.client.get(self.url)
        print("Response status code:", response.status_code)
        print("Response data:", response.json())
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_access_denied_for_non_instructors(self):
        print("Testing access for non-instructor...")
        non_instructor_user = User.objects.create_user(username='noninstructor', password='password123')
        non_instructor_token, _ = Token.objects.get_or_create(user=non_instructor_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + non_instructor_token.key)
        response = self.client.get(self.url)
        print("Response status code for non-instructor:", response.status_code)
        print("Response data for non-instructor:", response.content.decode())
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_invalid_class_id(self):
        print("Testing access with invalid class ID...")
        invalid_class_id = self.classe.id + 9999  # Assicurati che questo ID non sia presente nel database
        invalid_url = reverse('get_students_by_class', kwargs={'class_id': invalid_class_id})
        response = self.client.get(invalid_url)
        print("Response status code for invalid class ID:", response.status_code)
        print("Response data for invalid class ID:", response.content.decode())
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_internal_server_error(self):
        # Assicurati di colpire il punto giusto con il patch, potrebbe essere un metodo specifico che solleva un'eccezione
        with patch('path.to.the.method.you.want.to.mock', side_effect=Exception("Errore simulato")):
            print("Testing response to internal server error...")
            response = self.client.get(self.url)
            print("Response status code for internal error:", response.status_code)
            print("Response data for internal error:", response.content.decode())
            
            # Verifica che la risposta sia 500 INTERNAL SERVER ERROR
            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
