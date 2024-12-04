from django.db import models
from django.contrib.auth.models import User

class Scuola(models.Model):
    nome = models.CharField(max_length=100)
    indirizzo = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.nome

class Classe(models.Model):
    anno = models.IntegerField()  # E.g., 3, 4, 5
    sezione = models.CharField(max_length=5)  # E.g., A, B
    scuola = models.ForeignKey(Scuola, on_delete=models.CASCADE, related_name="classi")

    def __str__(self):
        return f"{self.anno}{self.sezione}"

class Studente(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="studente_profile")
    classe = models.ForeignKey(Classe, on_delete=models.SET_NULL, null=True, related_name="studenti")

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Insegnante(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="insegnante_profile")
    materie = models.ManyToManyField('Materia', related_name="insegnanti")
    classi_insegnate = models.ManyToManyField('Classe', related_name="insegnanti_insegnano", blank=True)  # Opzionale con 'blank=True'

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Materia(models.Model):
    nome = models.CharField(max_length=100)
    classi = models.ManyToManyField('Classe', related_name="materie")
    utenti = models.ManyToManyField(User, related_name="materie_utente")

    def __str__(self):
        return self.nome

class Voto(models.Model):
    studente = models.ForeignKey('Studente', on_delete=models.CASCADE, related_name='voti')
    materia = models.ForeignKey('Materia', on_delete=models.CASCADE, related_name='voti')
    scritto = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    orale = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    appunti = models.TextField(null=True, blank=True)  # Campo aggiuntivo per appunti dell'insegnante
    data = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Voto di {self.studente} in {self.materia}"

from django.utils import timezone

class Presenza(models.Model):
    studente = models.ForeignKey(Studente, on_delete=models.CASCADE, related_name="presenze")
    data = models.DateField(auto_now_add=True)
    stato = models.CharField(max_length=10, choices=[('presente', 'Presente'), ('assente', 'Assente')])
    entrata_ritardo = models.TimeField(null=True, blank=True)
    uscita_anticipata = models.TimeField(null=True, blank=True)
    giustificazione = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Controlla se ci sono già record per lo studente nella data odierna
        oggi = timezone.now().date()
        esiste_gia_presenza_oggi = Presenza.objects.filter(studente=self.studente, data=oggi).exists()

        if not esiste_gia_presenza_oggi:
            # Se non ci sono record per oggi, salva il nuovo record
            super().save(*args, **kwargs)
        else:
            # Se esistono già record per oggi, recupera l'ultima presenza registrata in ordine di inserimento
            ultima_presenza = Presenza.objects.filter(studente=self.studente, data=oggi).order_by('-id').first()
            
            # Confronta lo stato del nuovo record con l'ultimo stato registrato
            if ultima_presenza is None or ultima_presenza.stato != self.stato:
                # Se non c'è un record precedente o lo stato è cambiato, salva il nuovo record
                super().save(*args, **kwargs)
            else:
                # Se lo stato è lo stesso, ignora il salvataggio
                print(f"Lo stato non è cambiato per {self.studente}. Nessun nuovo record salvato.")


class Orario(models.Model):
    
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE, related_name="orari")
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name="orari")
    giornoSettimana = models.CharField(max_length=10) #, choices=GIORNI_SETTIMANA
    ora_inizio = models.TimeField()
    ora_fine = models.TimeField()
    ultimo_aggiornamento = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.classe} - {self.materia} ({self.giornoSettimana} {self.ora_inizio} - {self.ora_fine})"