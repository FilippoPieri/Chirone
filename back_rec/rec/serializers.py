from rest_framework import serializers
from .models import User,Classe, Studente, Insegnante, Materia, Voto, Presenza, Orario

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Creazione di un nuovo utente con password crittografata
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
class ClasseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Classe
        fields = ['id', 'anno', 'sezione', 'scuola']

class StudenteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Studente
        fields = ['id', 'user', 'classe']

class InsegnanteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Insegnante
        fields = ['id', 'user', 'materie']

class MateriaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Materia
        fields = ['id', 'nome', 'classi']

class VotoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Voto
        fields = ['id', 'studente', 'materia', 'scritto', 'orale', 'data']

class PresenzaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Presenza
        fields = ['id', 'studente', 'data', 'stato', 'entrata_ritardo', 'uscita_anticipata', 'giustificazione']

class OrarioSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Orario
        fields = ['id', 'classe', 'materia', 'giornoSettimana', 'ora_inizio', 'ora_fine']