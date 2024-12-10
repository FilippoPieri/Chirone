# Chirone

Dipendenze Django:

    asgiref==3.8.1
    Django==5.1.2
    django-cors-headers==4.6.0
    django-filter==24.3
    djangorestframework==3.15.2
    djangorestframework-simplejwt==5.3.1
    PyJWT==2.10.0
    sqlparse==0.5.1
    tzdata==2024.2

Dipendenze react:

    "prop-types": "^15.8.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"



TUTORIAL:

DJANGO:

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
-----------------------------------------------------------------------------------------------------------------------------------

REACT

crea una cartella chiamata front_rec e configura Vite con un template React

  npm create vite@latest front_rec -- --template react  
____________________________________________________________________________________________________________________________________

spostati nella cartella creata

 cd front_rec
____________________________________________________________________________________________________________________________________

installa le dipendenze

 npm install
____________________________________________________________________________________________________________________________________

avvia il server di sviluppo (solitamente http://localhost:5173)

 npm run dev
_____________________________________________________________________________________________________________________________________

