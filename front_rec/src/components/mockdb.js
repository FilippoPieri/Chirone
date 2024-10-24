// mockdb.js

// Scuole
export const scuole = [
    { id: 1, nome: 'Scuola Elementare A', indirizzo: 'Via Roma 1'},
    { id: 2, nome: 'Scuola Media B', indirizzo: 'Via Milano 10'},
];

// Classi
export const classi = [
    { id: 1, sezione: 'A', anno: 1, scuolaId: 1 },
    { id: 2, sezione: 'B', anno: 2, scuolaId: 2 },
    { id: 3, sezione: 'C', anno: 3, scuolaId: 1 },
    { id: 4, sezione: 'D', anno: 1, scuolaId: 2 },
    { id: 5, sezione: 'E', anno: 3, scuolaId: 1 },
    { id: 6, sezione: 'F', anno: 2, scuolaId: 2 },
];

// Studenti
export const studenti = [
    { id: 1, nome: 'Mario', cognome: 'Rossi', dataNascita: '2010-06-15', classeId: 1, email: 'mario@rossi.com', password: 'mario123', ruolo: 'studente' },
    { id: 2, nome: 'Giulia', cognome: 'Bianchi', dataNascita: '2009-09-21', classeId: 2, email: 'giulia@bianchi.com', password: 'giulia123', ruolo: 'studente' },
    { id: 3, nome: 'Luca', cognome: 'Verdi', dataNascita: '2011-01-12', classeId: 1, email: 'luca@verdi.com', password: 'luca123', ruolo: 'studente' },
    { id: 4, nome: 'Sofia', cognome: 'Neri', dataNascita: '2010-03-05', classeId: 2, email: 'sofia@neri.com', password: 'sofia123', ruolo: 'studente' },
    { id: 5, nome: 'Marco', cognome: 'Gialli', dataNascita: '2012-08-22', classeId: 3, email: 'marco@gialli.com', password: 'marco123', ruolo: 'studente' },
    { id: 6, nome: 'Alice', cognome: 'Blu', dataNascita: '2011-11-14', classeId: 4, email: 'alice@blu.com', password: 'alice123', ruolo: 'studente' },
    { id: 7, nome: 'Davide', cognome: 'Marroni', dataNascita: '2010-09-11', classeId: 5, email: 'davide@marroni.com', password: 'davide123', ruolo: 'studente' },
    { id: 8, nome: 'Sara', cognome: 'Viola', dataNascita: '2009-02-13', classeId: 6, email: 'sara@viola.com', password: 'sara123', ruolo: 'studente' },
    { id: 9, nome: 'Alessandro', cognome: 'Verde', dataNascita: '2011-07-25', classeId: 1, email: 'alessandro@verde.com', password: 'alessandro123', ruolo: 'studente' },
];

// Voti
export const voti = [
    { id: 1, studenteId: 1, materiaId: 1, scritto: 8.5, data: '2023-03-12' },
    { id: 2, studenteId: 2, materiaId: 2, orale: 8.5, data: '2023-03-13' },
    { id: 3, studenteId: 3, materiaId: 1, orale: 7.5, data: '2023-05-14' },
    { id: 4, studenteId: 4, materiaId: 2, scritto: 6.5, data: '2023-05-15' },
    { id: 5, studenteId: 5, materiaId: 1, scritto: 9.0, data: '2023-06-16' },
    { id: 6, studenteId: 6, materiaId: 3, scritto: 8.0, data: '2023-06-17' },
    { id: 7, studenteId: 7, materiaId: 1, orale: 8.0, data: '2023-06-18' },
    { id: 8, studenteId: 8, materiaId: 3, orale: 9.5, data: '2023-06-19' },
    { id: 9, studenteId: 9, materiaId: 1, scritto: 8.5, data: '2023-06-20' },
];

// Materie
export const materie = [
    { id: 1, nomeMateria: 'Matematica', insegnanteId: 1, classiIds: [1, 3] },
    { id: 2, nomeMateria: 'Italiano', insegnanteId: 2, classiIds: [2, 4] },
    { id: 3, nomeMateria: 'Scienze', insegnanteId: 5, classiIds: [1, 3] },
    { id: 4, nomeMateria: 'Educazione Fisica', insegnanteId: 8, classiIds: [1] },
];

// Insegnanti
export const insegnanti = [
    { id: 1, nome: 'Lucia', cognome: 'Verdi', materia: 'Matematica', scuolaId: 1, email: 'lucia@verdi', password: 'lucia123', ruolo: 'insegnante'  },
    { id: 2, nome: 'Giovanni', cognome: 'Neri', materia: 'Italiano', scuolaId: 2, email: 'giovanni@neri', password: 'giovanni123', ruolo: 'insegnante'  },
    { id: 3, nome: 'Paolo', cognome: 'Bianchi', materia: 'Matematica', scuolaId: 1, email: 'paolo@bianchi', password: 'paolo123', ruolo: 'insegnante'  },
    { id: 4, nome: 'Anna', cognome: 'Rossi', materia: 'Italiano', scuolaId: 2, email: 'anna@rossi', password: 'anna123', ruolo: 'insegnante'  },
    { id: 5, nome: 'Chiara', cognome: 'Gallo', materia: 'Scienze', scuolaId: 1, email: 'chiara@gallo', password: 'chiara123', ruolo: 'insegnante'  },
    { id: 6, nome: 'Marco', cognome: 'Bianchi', materia: 'Matematica', scuolaId: 1, email: 'marco@bianchi', password: 'marco123', ruolo: 'insegnante'  },
    { id: 7, nome: 'Marco', cognome: 'Gialli', materia: 'Ed.Fisica', scuolaId: 1, email: 'marco@gialli', password: 'marco123', ruolo: 'insegnante'  },
    { id: 8, nome: 'Stefania', cognome: 'Verdi', materia: 'Educazione Fisica', scuolaId: 1, email: 'stefania@verdi', password: 'stefania123', ruolo: 'insegnante'  },
];

// Presenze
export const presenze = [
    { id: 1, studenteId: 1, data: '2023-09-14', stato: 'Presente', orarioEntrata: '10:00', orarioUscita: '13:00', giustificazioneConfermata: false },
    { id: 2, studenteId: 2, data: '2023-09-14', stato: 'Assente', orarioEntrata: '00:00', orarioUscita: '00:00', giustificazioneConfermata: true  },
    { id: 3, studenteId: 3, data: '2023-09-15', stato: 'Presente', orarioEntrata: '08:00', orarioUscita: '12:30', giustificazioneConfermata: false },
    { id: 4, studenteId: 4, data: '2023-09-15', stato: 'Presente', orarioEntrata: '08:30', orarioUscita: '12:00', giustificazioneConfermata: true  },
    { id: 5, studenteId: 5, data: '2023-09-16', stato: 'Assente', orarioEntrata: '00:00', orarioUscita: '00:00', giustificazioneConfermata: false },
    { id: 6, studenteId: 6, data: '2023-09-16', stato: 'Presente', orarioEntrata: '08:00', orarioUscita: '13:00', giustificazioneConfermata: true  },
];

export const orariLezione = [
    // Scuola Elementare A (ID: 1)
    // Classe 1A
    { id: 1, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Lunedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 2, materiaId: 3, insegnanteId: 5, classeId: 1, scuolaId: 1, giorno: 'Lunedi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 3, materiaId: 4, insegnanteId: 8, classeId: 1, scuolaId: 1, giorno: 'Lunedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 4, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Lunedi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 5, materiaId: 2, insegnanteId: 2, classeId: 1, scuolaId: 1, giorno: 'Lunedi', oraInizio: '12:00', oraFine: '13:00' },

    { id: 1, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Martedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 2, materiaId: 3, insegnanteId: 5, classeId: 1, scuolaId: 1, giorno: 'Martedi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 3, materiaId: 4, insegnanteId: 8, classeId: 1, scuolaId: 1, giorno: 'Martedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 4, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Martedi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 5, materiaId: 2, insegnanteId: 2, classeId: 1, scuolaId: 1, giorno: 'Martedi', oraInizio: '12:00', oraFine: '13:00' },

    { id: 1, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Mercoledi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 2, materiaId: 3, insegnanteId: 5, classeId: 1, scuolaId: 1, giorno: 'Mercoledi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 3, materiaId: 4, insegnanteId: 8, classeId: 1, scuolaId: 1, giorno: 'Mercoledi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 4, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Mercoledi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 5, materiaId: 2, insegnanteId: 2, classeId: 1, scuolaId: 1, giorno: 'Mercoledi', oraInizio: '12:00', oraFine: '13:00' },

    { id: 1, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Giovedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 2, materiaId: 3, insegnanteId: 5, classeId: 1, scuolaId: 1, giorno: 'Giovedi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 3, materiaId: 4, insegnanteId: 8, classeId: 1, scuolaId: 1, giorno: 'Giovedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 4, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Giovedi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 5, materiaId: 2, insegnanteId: 2, classeId: 1, scuolaId: 1, giorno: 'Giovedi', oraInizio: '12:00', oraFine: '13:00' },

    { id: 1, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Venerdì', oraInizio: '08:00', oraFine: '09:00' },
    { id: 2, materiaId: 3, insegnanteId: 5, classeId: 1, scuolaId: 1, giorno: 'Venerdì', oraInizio: '09:00', oraFine: '10:00' },
    { id: 3, materiaId: 4, insegnanteId: 8, classeId: 1, scuolaId: 1, giorno: 'Venerdì', oraInizio: '10:00', oraFine: '11:00' },
    { id: 4, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Venerdì', oraInizio: '11:00', oraFine: '12:00' },
    { id: 5, materiaId: 2, insegnanteId: 2, classeId: 1, scuolaId: 1, giorno: 'Venerdì', oraInizio: '12:00', oraFine: '13:00' },

    { id: 1, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Sabato', oraInizio: '08:00', oraFine: '09:00' },
    { id: 2, materiaId: 3, insegnanteId: 5, classeId: 1, scuolaId: 1, giorno: 'Sabato', oraInizio: '09:00', oraFine: '10:00' },
    { id: 3, materiaId: 4, insegnanteId: 8, classeId: 1, scuolaId: 1, giorno: 'Sabato', oraInizio: '10:00', oraFine: '11:00' },
    { id: 4, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Sabato', oraInizio: '11:00', oraFine: '12:00' },
    { id: 5, materiaId: 2, insegnanteId: 2, classeId: 1, scuolaId: 1, giorno: 'Sabato', oraInizio: '12:00', oraFine: '13:00' },
    
    // Classe 1C
    { id: 6, materiaId: 1, insegnanteId: 1, classeId: 3, scuolaId: 1, giorno: 'Lunedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 7, materiaId: 3, insegnanteId: 5, classeId: 3, scuolaId: 1, giorno: 'Lunedi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 8, materiaId: 4, insegnanteId: 8, classeId: 3, scuolaId: 1, giorno: 'Lunedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 9, materiaId: 1, insegnanteId: 3, classeId: 3, scuolaId: 1, giorno: 'Lunedi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 10, materiaId: 2, insegnanteId: 4, classeId: 3, scuolaId: 1, giorno: 'Lunedi', oraInizio: '12:00', oraFine: '13:00' },

    // Scuola Media B (ID: 2)
    // Classe 2B
    { id: 11, materiaId: 2, insegnanteId: 2, classeId: 2, scuolaId: 2, giorno: 'Lunedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 12, materiaId: 1, insegnanteId: 1, classeId: 2, scuolaId: 2, giorno: 'Lunedi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 13, materiaId: 3, insegnanteId: 5, classeId: 2, scuolaId: 2, giorno: 'Lunedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 14, materiaId: 4, insegnanteId: 8, classeId: 2, scuolaId: 2, giorno: 'Lunedi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 15, materiaId: 1, insegnanteId: 3, classeId: 2, scuolaId: 2, giorno: 'Lunedi', oraInizio: '12:00', oraFine: '13:00' },
    
    // Classe 2D
    { id: 16, materiaId: 2, insegnanteId: 2, classeId: 4, scuolaId: 2, giorno: 'Lunedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 17, materiaId: 1, insegnanteId: 1, classeId: 4, scuolaId: 2, giorno: 'Lunedi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 18, materiaId: 3, insegnanteId: 5, classeId: 4, scuolaId: 2, giorno: 'Lunedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 19, materiaId: 4, insegnanteId: 8, classeId: 4, scuolaId: 2, giorno: 'Lunedi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 20, materiaId: 1, insegnanteId: 3, classeId: 4, scuolaId: 2, giorno: 'Lunedi', oraInizio: '12:00', oraFine: '13:00' },
   
    // Ripeti per il resto dei giorni (Martedì, Mercoledì, Giovedì, Venerdì) per ciascuna classe e materia
    // ...
    
    // Esempio per Martedì (tutte le classi e le materie)
    // Classe 1A
    { id: 21, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Martedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 22, materiaId: 3, insegnanteId: 5, classeId: 1, scuolaId: 1, giorno: 'Martedi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 23, materiaId: 4, insegnanteId: 8, classeId: 1, scuolaId: 1, giorno: 'Martedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 24, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Martedi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 25, materiaId: 2, insegnanteId: 2, classeId: 1, scuolaId: 1, giorno: 'Martedi', oraInizio: '12:00', oraFine: '13:00' },
    
    // Classe 1C
    { id: 26, materiaId: 1, insegnanteId: 1, classeId: 3, scuolaId: 1, giorno: 'Martedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 27, materiaId: 3, insegnanteId: 5, classeId: 3, scuolaId: 1, giorno: 'Martedi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 28, materiaId: 4, insegnanteId: 8, classeId: 3, scuolaId: 1, giorno: 'Martedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 29, materiaId: 1, insegnanteId: 3, classeId: 3, scuolaId: 1, giorno: 'Martedi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 30, materiaId: 2, insegnanteId: 4, classeId: 3, scuolaId: 1, giorno: 'Martedi', oraInizio: '12:00', oraFine: '13:00' },
    
    // Classe 2B
    { id: 31, materiaId: 2, insegnanteId: 2, classeId: 2, scuolaId: 2, giorno: 'Martedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 32, materiaId: 1, insegnanteId: 1, classeId: 2, scuolaId: 2, giorno: 'Martedi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 33, materiaId: 3, insegnanteId: 5, classeId: 2, scuolaId: 2, giorno: 'Martedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 34, materiaId: 4, insegnanteId: 8, classeId: 2, scuolaId: 2, giorno: 'Martedi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 35, materiaId: 1, insegnanteId: 3, classeId: 2, scuolaId: 2, giorno: 'Martedi', oraInizio: '12:00', oraFine: '13:00' },
    
    // Classe 2D
    { id: 36, materiaId: 2, insegnanteId: 2, classeId: 4, scuolaId: 2, giorno: 'Martedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 37, materiaId: 1, insegnanteId: 1, classeId: 4, scuolaId: 2, giorno: 'Martedi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 38, materiaId: 3, insegnanteId: 5, classeId: 4, scuolaId: 2, giorno: 'Martedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 39, materiaId: 4, insegnanteId: 8, classeId: 4, scuolaId: 2, giorno: 'Martedi', oraInizio: '11:00', oraFine: '12:00' },
    { id: 40, materiaId: 1, insegnanteId: 3, classeId: 4, scuolaId: 2, giorno: 'Martedi', oraInizio: '12:00', oraFine: '13:00' },
];