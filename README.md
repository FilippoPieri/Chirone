# Chirone

Dipendenze Django:


Dipendenze react:


TUTORIAL:

Django

in cmd:
 
git clone https://github.com/FilippoPieri/rec.git (link repository)
___________________________________________________________________________________________



comandi git per creare il progetto:
___________________________________________________________________________________________________________________________________

creare virtual env:

  python -m venv .venv
___________________________________________________________________________________________________________________________________

attivare virtual env:

 source .venv/Scripts/activate
___________________________________________________________________________________________________________________________________

installare Django:

 pip install Django
___________________________________________________________________________________________________________________________________

creare progetto:

 django-admin startproject back_rec
 __________________________________________________________________________________________________________________________________

spostarsi dentro al progetto:

 cd back_rec
___________________________________________________________________________________________________________________________________

run server:
 python manage.py runserver
 control+c (per uscire dal server)
___________________________________________________________________________________________________________________________________

creare app:

 python manage.py startapp rec
___________________________________________________________________________________________________________________________________

spostarsi nella cartella dell'app:

 cd rec
___________________________________________________________________________________________________________________________________

andare in settings.py e inserire rec in installed_app
___________________________________________________________________________________________________________________________________

migrazioni:
 cd .. (torna nella directory precedente contentnte mange.py)
 python manage.py makemigrations
 python manage.py migrate
___________________________________________________________________________________________________________________________________

creare superuser:

 python manage.py createsuperuser
 (inserire nome utente, email, password)
___________________________________________________________________________________________________________________________________

avviare il server e andare in admin per inserire maualmente dei dati
urls: 127.0.0.1:8000/admin

oppure creare uteni e post direttamente dall'app
___________________________________________________________________________________________________________________________________