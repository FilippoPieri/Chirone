from rest_framework import serializers
from .models import Insegnante, OrarioLezioni

class InsegnanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insegnante
        fields = '__all__'

class OrarioLezioniSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrarioLezioni
        fields = '__all__'