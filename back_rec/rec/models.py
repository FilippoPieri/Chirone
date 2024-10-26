from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

# Modello utente personalizzato
class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        STUDENTE = 'studente', _('Studente')
        INSEGNANTE = 'insegnante', _('Insegnante')

    ruolo = models.CharField(
        max_length=50,
        choices=Role.choices,
        default=Role.STUDENTE,
    )

    def __str__(self):
        return f'{self.username} ({self.ruolo})'
    
# Modello Scuola
class Scuola(models.Model):
    nome = models.CharField(max_length=255)
    indirizzo = models.CharField(max_length=255)

    def __str__(self):
        return self.nome

# Modello Classe
class Classe(models.Model):
    sezione = models.CharField(max_length=1)
    anno = models.IntegerField()
    scuola = models.ForeignKey(Scuola, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.anno}{self.sezione}'

# Modello Studente
class Studente(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='studente_profile')
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'

# Modello Insegnante
class Insegnante(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='insegnante_profile')
    materia = models.CharField(max_length=100)
    scuola = models.ForeignKey(Scuola, on_delete=models.CASCADE)
    classi = models.ManyToManyField('Classe', related_name='insegnanti')

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'

# Modello Materia
class Materia(models.Model):
    nome_materia = models.CharField(max_length=100)
    insegnante = models.ForeignKey(Insegnante, on_delete=models.CASCADE, related_name='materie_insegnate')

    def __str__(self):
        return self.nome_materia

# Modello Voto
class Voto(models.Model):
    studente = models.ForeignKey(Studente, on_delete=models.CASCADE)
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)
    scritto = models.FloatField(null=True, blank=True)
    orale = models.FloatField(null=True, blank=True)
    data = models.DateField()

    def __str__(self):
        return f'Voto {self.studente} - {self.materia}'

# Modello Presenza
class Presenza(models.Model):
    studente = models.ForeignKey(Studente, on_delete=models.CASCADE)
    data = models.DateField()
    stato = models.CharField(max_length=20)  # Presente o Assente
    orario_entrata = models.TimeField(null=True, blank=True)
    orario_uscita = models.TimeField(null=True, blank=True)
    giustificazione_confermata = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.studente.user.first_name} {self.studente.user.last_name} - {self.data}'

# Modello OrarioLezioni
class OrarioLezioni(models.Model):
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)
    insegnante = models.ForeignKey(Insegnante, on_delete=models.CASCADE)
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE)
    giorno = models.CharField(max_length=20)  # Lunedi, Martedi, ecc.
    ora_inizio = models.TimeField()
    ora_fine = models.TimeField()

    def __str__(self):
        return f'{self.materia.nome_materia} - {self.giorno} {self.ora_inizio}-{self.ora_fine}'

# Modello Agenda
class Agenda(models.Model):
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE)
    insegnante = models.ForeignKey(Insegnante, on_delete=models.CASCADE)
    data = models.DateField()
    argomenti_trattati = models.TextField(blank=True)
    compiti = models.TextField(blank=True)

    def __str__(self):
        return f'Agenda per {self.classe} - {self.data}'
