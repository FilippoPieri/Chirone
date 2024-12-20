from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

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

from django.db import models

class Voto(models.Model):
    studente = models.ForeignKey('Studente', on_delete=models.CASCADE, related_name='voti')
    materia = models.ForeignKey('Materia', on_delete=models.CASCADE, related_name='voti')
    scritto = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    orale = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    appunti = models.TextField(null=True, blank=True)  # Campo aggiuntivo per appunti dell'insegnante
    data = models.DateField(auto_now_add=True)

    def formatta_voto(self, voto):
        if voto is None:
            return None
        base = int(voto)
        decimal = voto - base
        if decimal == 0:
            return str(base)
        elif decimal == 0.25:
            return f"{base}+"
        elif decimal == 0.5:
            return f"{base}.5"
        elif decimal == 0.75:
            return f"{base + 1}-"
        return str(voto)

    def get_scritto_formattato(self):
        return self.formatta_voto(self.scritto)

    def get_orale_formattato(self):
        return self.formatta_voto(self.orale)

    def __str__(self):
        voto_scritto = self.get_scritto_formattato() if self.scritto is not None else "N/A"
        voto_orale = self.get_orale_formattato() if self.orale is not None else "N/A"
        return f"Voto di {self.studente} in {self.materia}: Scritto {voto_scritto}, Orale {voto_orale}"


class Presenza(models.Model):
    studente = models.ForeignKey('Studente', on_delete=models.CASCADE, related_name="presenze")
    classe = models.ForeignKey('Classe', on_delete=models.CASCADE, related_name="presenze_classe", null=True)
    data = models.DateField(auto_now_add=True)
    stato = models.CharField(max_length=10, choices=[('presente', 'Presente'), ('assente', 'Assente')])
    entrata_ritardo = models.TimeField(null=True, blank=True)
    uscita_anticipata = models.TimeField(null=True, blank=True)
    giustificazione = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Ottieni la data corrente
        oggi = timezone.now().date()

        # Cerca una presenza esistente per lo studente nella data corrente
        presenza_esistente = Presenza.objects.filter(studente=self.studente, data=oggi).first()

        if presenza_esistente:
            # Dizionario per tenere traccia dei campi aggiornati
            updated_fields = {}

            # Verifica e aggiorna lo stato se necessario
            if presenza_esistente.stato != self.stato:
                updated_fields['stato'] = self.stato

            # Aggiunge controllo per assicurarsi che l'orario di entrata ritardata sia maggiore di quello già registrato
            if self.entrata_ritardo is not None and (presenza_esistente.entrata_ritardo is None or self.entrata_ritardo > presenza_esistente.entrata_ritardo):
                updated_fields['entrata_ritardo'] = self.entrata_ritardo

            # Aggiunge controllo per assicurarsi che l'orario di uscita anticipata sia maggiore di quello già registrato
            if self.uscita_anticipata is not None and (presenza_esistente.uscita_anticipata is None or self.uscita_anticipata > presenza_esistente.uscita_anticipata):
                updated_fields['uscita_anticipata'] = self.uscita_anticipata

            # Controlla e aggiorna la giustificazione se necessario
            if presenza_esistente.giustificazione != self.giustificazione:
                updated_fields['giustificazione'] = self.giustificazione

            # Aggiorna il record esistente solo se ci sono campi modificati
            if updated_fields:
                Presenza.objects.filter(id=presenza_esistente.id).update(**updated_fields)
        else:
            # Se non esiste un record per oggi, crea un nuovo record
            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.studente.user.get_full_name()} - {self.data} - {self.stato}"

    class Meta:
        ordering = ['-data', 'studente']
        verbose_name_plural = "Presenze"

class Orario(models.Model):
    
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE, related_name="orari")
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name="orari")
    giornoSettimana = models.CharField(max_length=10) #, choices=GIORNI_SETTIMANA
    ora_inizio = models.TimeField()
    ora_fine = models.TimeField()
    ultimo_aggiornamento = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.classe} - {self.materia} ({self.giornoSettimana} {self.ora_inizio} - {self.ora_fine})"