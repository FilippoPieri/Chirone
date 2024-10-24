from django.db import models

# modello scuola
# Collega ogni scuola a un comprensivo e include informazioni sulla scuola stessa.
class Scuola(models.Model):
    nome = models.CharField(max_length=255)
    indirizzo = models.CharField(max_length=255)

    def __str__(self):
        return self.nome
#_____________________________________________________________________________________________________

class Classe(models.Model):
    sezione = models.CharField(max_length=1)
    anno = models.IntegerField()
    scuola = models.ForeignKey(Scuola, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.anno}{self.sezione}'
#____________________________________________________________________________________________________

class Studente(models.Model):
    nome = models.CharField(max_length=100)
    cognome = models.CharField(max_length=100)
    data_nascita = models.DateField()
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE)
    ruolo = models.CharField(max_length=50, default='studente')

    def __str__(self):
        return f'{self.nome} {self.cognome}'
#___________________________________________________________________________________________________ 

class Insegnante(models.Model):
    nome = models.CharField(max_length=100)
    cognome = models.CharField(max_length=100)
    materia = models.CharField(max_length=100)
    scuola = models.ForeignKey(Scuola, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    ruolo = models.CharField(max_length=50, default='insegnante')

    def __str__(self):
        return f'{self.nome} {self.cognome}'
#__________________________________________________________________________________________________

class Materia(models.Model):
    nome_materia = models.CharField(max_length=100)
    insegnante = models.ForeignKey(Insegnante, on_delete=models.CASCADE, related_name='materie_insegnate')
   
    def __str__(self):
        return self.nome_materia
#_________________________________________________________________________________________________

class Voto(models.Model):
    studente = models.ForeignKey(Studente, on_delete=models.CASCADE)
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)
    scritto = models.FloatField(null=True, blank=True)
    orale = models.FloatField(null=True, blank=True)
    data = models.DateField()

    def __str__(self):
        return f'Voto {self.studente} - {self.materia}'
#_________________________________________________________________________________________________
    
class Presenza(models.Model):
    studente = models.ForeignKey(Studente, on_delete=models.CASCADE)
    data = models.DateField()
    stato = models.CharField(max_length=20)  # Presente o Assente
    orario_entrata = models.TimeField(null=True, blank=True)
    orario_uscita = models.TimeField(null=True, blank=True)
    giustificazione_confermata = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.studente.nome} {self.studente.cognome} - {self.data}'
#_________________________________________________________________________________________________
    
class OrarioLezioni(models.Model):
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)
    insegnante = models.ForeignKey(Insegnante, on_delete=models.CASCADE)
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE)
    giorno = models.CharField(max_length=20)  # Lunedi, Martedi, ecc.
    ora_inizio = models.TimeField()
    ora_fine = models.TimeField()

    def __str__(self):
        return f'{self.materia.nome_materia} - {self.giorno} {self.ora_inizio}-{self.ora_fine}'
#_________________________________________________________________________________________________

class Agenda(models.Model):
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE)
    insegnante = models.ForeignKey(Insegnante, on_delete=models.CASCADE)
    data = models.DateField()
    argomenti_trattati = models.TextField(blank=True)
    compiti = models.TextField(blank=True)

    def __str__(self):
        return f'Agenda per {self.classe} - {self.data}'
#_________________________________________________________________________________________________

