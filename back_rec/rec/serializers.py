from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Classe, Studente, Insegnante, Materia, Voto, Orario, Presenza

class AuthTokenSerializer(serializers.Serializer):
    username = serializers.CharField(label="Username")
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                raise serializers.ValidationError('Credenziali non valide', code='authorization')
        else:
            raise serializers.ValidationError('Devi includere "username" e "password".')
        
        data['user'] = user
        return data
    
class ClasseSerializer(serializers.ModelSerializer):
    scuola_id = serializers.ReadOnlyField(source='scuola.id')
    scuola_nome = serializers.ReadOnlyField(source='scuola.nome')

    class Meta:
        model = Classe
        fields = ['id', 'anno', 'sezione', 'scuola_id', 'scuola_nome']

class StudenteSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='user.first_name')
    cognome = serializers.CharField(source='user.last_name')
    username = serializers.CharField(source='user.username')

    class Meta:
        model = Studente
        fields = ['id', 'nome', 'cognome', 'username']

class InsegnanteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Insegnante
        fields = ['id', 'user', 'materie']

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = ['id', 'nome' ]

class VotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voto
        fields = ['studente', 'materia', 'scritto', 'orale', 'appunti', 'data']

class PresenzaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presenza
        fields = ['id', 'studente', 'data', 'stato', 'entrata_ritardo', 'uscita_anticipata', 'giustificazione']

    def create(self, validated_data):
        # Logica personalizzata, se necessaria
        return Presenza.objects.create(**validated_data)

class OrarioSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Orario
        fields = ['id', 'classe', 'materia', 'giornoSettimana', 'ora_inizio', 'ora_fine']