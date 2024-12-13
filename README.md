<h1> Chirone </h1>

    Chirone è un'applicazione per la gestione di un registro scolastico online che permette di gestire classi, studenti, insegnanti, voti, presenze e orari delle lezioni costruita utilizzando un backend Django e un frontend React Vite.

    La creazione di Classi, Scuole, Materie, Insegnanti, Studenti, Materie, Utenti, Gruppi è gestita dall'amministrazione:

    i gruppi servono per dare i permessi agli utenti:

     Insegnante può leggere e scrivere

     Studente può solo leggere

    mentre le classi Insegnante e Studente sono necessari per collegare gli utenti alle varie classi.



<h1> Prerequisiti </h1>

    Backend:

        Python 3.12.8 
        Virtualenv
    
    Frontend:

        Node.js v20.17.0

<h1> Dipendenze Django: </h1>

    asgiref==3.8.1
    Django==5.1.2
    django-cors-headers==4.6.0
    django-filter==24.3
    djangorestframework==3.15.2
    djangorestframework-simplejwt==5.3.1
    PyJWT==2.10.0
    sqlparse==0.5.1
    tzdata==2024.2

<h1> Dipendenze react: </h1>

    "prop-types": "^15.8.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
    
<br>


<h1> Struttura del Progetto </h1>

  <b> BACKEND </B>

    Models: 

          Gestione di entità come classi, studenti, insegnanti, voti, presenze e 
          orari.

    API REST:

          Endpoint CRUD per le operazioni sulle entità.

    Autenticazione:

          Utilizza JWT per autenticare le richieste.

  <b> FRONTEND </B>

    Componenti principali:

      App.jsx: 

          Punto di ingresso principale.

      Features.jsx: 

          Funzionalità per gli insegnanti.

      FeaturesStudenti.jsx: 

          Funzionalità per gli studenti.

  <b> Autenticazione: </b>

        Login e gestione dei token (JWT).
        
        Gestione automatica dei token di accesso e refresh.

<br>

<h1> Funzionalità principali </h1>


  <b> 1. Gestione presenze: </b>

        Appello per classe.

        Visualizzazione delle assenze dello studente.


  <b> 2. Gestione voti: </b>

        Inserimento voti per gli insegnanti.

        Visualizzazione dei voti per gli studenti.


  <b> 3. Gestione orari: </b>

        Inserimento e modifica dell'orario per gli insegnanti. 

        Visualizzazione orario settimanale per studenti.

<br>

<h1> Funzioni da implementare </h1>

    1. Calcolo delle ore basato sull'orario delle lezioni 

    2. Inserimento di avvisi nel frontend in caso di azioni non consentite 

    3. Inserimento di aniazioni per il caricamento dei dati

    4. Media dei voti con possibilità di modifica da parte dell'insegnante

    5. possibilità di modificare i voti e i dati dell'appello da parte dell'insegnante

    6. Creazione funzione "Agenda" dove l'insegnante potrà segnare note, compiti ecc.. 
       e studente potrà visualizzarli

    7. Creazione funzione "Argomenti trattati" dove l'insegnante potrà scrivere i temi 
        delle lezioni affrontate durante la lezione e gli studenti potranno consultarla

    8. Creazione di utenti "Coordinatore di classe" e "segreteria" 

    9. Creazione funzione "Ricevimenti" dove sarà possibile prendere appuntamento con        
       l'insegnante

    10. Implementare possibilità di modificare password   
          

<h2> Crediti </h2>

    Applicazione sviluppata da Filippo Pieri con l'ausilio di AI








  
