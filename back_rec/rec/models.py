from django.db import models

# modello comprensivo
# Rappresenta un gruppo di scuole, con informazioni come nome, indirizzo e telefono.
class Comprensivo(models.Model):
    nome = models.CharField(max_length=100)
    indirizzo = models.CharField(max_length=255)  # Indirizzo del comprensivo
    telefono = models.CharField(max_length=20, null=True, blank=True)  # Telefono del comprensivo

    def __str__(self):
        return self.nome
#_____________________________________________________________________________________________________
    
# modello scuola
# Collega ogni scuola a un comprensivo e include informazioni sulla scuola stessa.
class Scuola(models.Model):
    nome = models.CharField(max_length=100)
    indirizzo = models.CharField(max_length=255)
    comprensivo = models.ForeignKey(Comprensivo, on_delete=models.CASCADE, related_name='scuole')

    def __str__(self):
        return f"{self.nome} ({self.comprensivo.nome})"
#_____________________________________________________________________________________________________

# modello classe
# Rappresenta le classi all'interno di una scuola, con un riferimento alla scuola stessa.
class Classe(models.Model):
    sezione = models.CharField(max_length=2) #a, b, c, ...
    anno = models.IntegerField() # 1, 2, 3, ...
    scuola = models.ForeignKey(Scuola, on_delete=models.CASCADE, related_name='classi')

    def __str__(self):
        return f"{self.sezione} {self.anno} - {self.scuola.nome}"
#____________________________________________________________________________________________________

# modello studente
# Memorizza le informazioni degli studenti, collegandoli a una classe.
class Studente(models.Model):
    nome = models.CharField(max_length=20)
    cognome = models.CharField(max_length=20)
    data_nascita = models.DateField()
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE, related_name='studenti')  # Relazionato con Classe, on_delete=models.CASCADE cancella tutti gli studenti associati se il corso viene cancellato

    def __str__(self):
        return f"{self.nome} {self.cognome} - {self.classe}"
#___________________________________________________________________________________________________ 

# modello insegnante
# Rappresenta gli insegnanti e le materie che insegnano, collegandoli a una scuola.
class Insegnante(models.Model):
    nome = models.CharField(max_length=20)
    cognome = models.CharField(max_length=20)
    materia = models.CharField(max_length=50)
    scuola = models.ForeignKey(Scuola, on_delete=models.CASCADE, related_name='insegnanti')

    def __str__(self):
        return f"{self.nome} {self.cognome} - {self.materia} ({self.scuola.nome})"
#__________________________________________________________________________________________________

# modello Materia
# Collega le materie agli insegnanti e alle classi.
class Materia(models.Model):
    nome_materia = models.CharField(max_length=100)
    insegnante = models.ForeignKey(Insegnante, on_delete=models.CASCADE, related_name='materie')  # Relazionato con Insegnante, on_delete=models.CASCADE cancella tutti gli studenti associati se il corso viene cancellato 
    classi = models.ManyToManyField(Classe, related_name='materie')  # Relazionato molti-a-molti con Classe

    def __str__(self):
        return f"{self.nome_materia} ({self.insegnante})"
#_________________________________________________________________________________________________

# modello voto
# Registra i voti degli studenti per le varie materie.
class Voto(models.Model):
    studente = models.ForeignKey(Studente, on_delete=models.CASCADE, related_name='voti')  # Relazionato con Studente, on_delete=models.CASCADE cancella tutti gli studenti associati se il corso viene cancellato
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)  # Relazionato con Materia on_delete=models.CASCADE cancella tutti gli studenti associati se il corso viene cancellato
    voto = models.DecimalField(max_digits=3, decimal_places=1) 
    data = models.DateField()
#_________________________________________________________________________________________________
    
# modello presenza
# Tiene traccia delle presenze e assenze degli studenti.
class Presenza(models.Model):
    studente = models.ForeignKey(Studente, on_delete=models.CASCADE, related_name='presenze')  # Relazionato con Studente, on_delete=models.CASCADE cancella tutti gli studenti associati se il corso viene cancellato
    data = models.DateField()
    stato = models.CharField(max_length=10, choices=[('Presente', 'Presente'), ('Assente', 'Assente')])  # Stato del corso (Presente o Assente)
    orario_entrata = models.TimeField()
    orario_uscita = models.TimeField()
#_________________________________________________________________________________________________
    
# modello orario
# Gestisce l'orario delle lezioni.
class OrarioLezione(models.Model):
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name='orari')
    insegnante = models.ForeignKey(Insegnante, on_delete=models.CASCADE, related_name='orari')
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE, related_name='orari')
    scuola = models.ForeignKey(Scuola, on_delete=models.CASCADE, related_name='orari')
    giorno = models.CharField(max_length=10, choices=[
        ('Lunedi', 'Lunedì'),
        ('Martedi', 'Martedì'),
        ('Mercoledi', 'Mercoledì'),
        ('Giovedi', 'Giovedì'),
        ('Venerdi', 'Venerdì'),
        ('Sabato', 'Sabato')
    ])
    ora_inizio = models.TimeField()
    ora_fine = models.TimeField()

    def __str__(self):
        return f"{self.materia} - {self.insegnante} ({self.classe}) - {self.scuola.nome} ({self.scuola.comprensivo.nome}) - {self.giorno} {self.ora_inizio} - {self.ora_fine}"
