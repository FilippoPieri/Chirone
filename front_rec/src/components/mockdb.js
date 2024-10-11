// mockdb.js

// Scuole
export const scuole = [
    { id: 1, nome: 'Scuola Elementare A', indirizzo: 'Via Roma 1', comprensivoId: 1 },
    { id: 2, nome: 'Scuola Media B', indirizzo: 'Via Milano 10', comprensivoId: 2 },
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
    { id: 1, nome: 'Mario', cognome: 'Rossi', dataNascita: '2010-06-15', classeId: 1 },
    { id: 2, nome: 'Giulia', cognome: 'Bianchi', dataNascita: '2009-09-21', classeId: 2 },
    { id: 3, nome: 'Luca', cognome: 'Verdi', dataNascita: '2011-01-12', classeId: 1 },
    { id: 4, nome: 'Sofia', cognome: 'Neri', dataNascita: '2010-03-05', classeId: 2 },
    { id: 5, nome: 'Marco', cognome: 'Gialli', dataNascita: '2012-08-22', classeId: 3 },
    { id: 6, nome: 'Alice', cognome: 'Blu', dataNascita: '2011-11-14', classeId: 4 },
    { id: 7, nome: 'Davide', cognome: 'Marroni', dataNascita: '2010-09-11', classeId: 5 },
    { id: 8, nome: 'Sara', cognome: 'Viola', dataNascita: '2009-02-13', classeId: 6 },
    { id: 9, nome: 'Alessandro', cognome: 'Verde', dataNascita: '2011-07-25', classeId: 1 },
];

// Voti
export const voti = [
    { id: 1, studenteId: 1, materiaId: 1, scritto: 8.5, scritto: 8.0, orale: 9.0, data: '2023-03-12' },
    { id: 2, studenteId: 2, materiaId: 2, scritto: 9.0, orale: 8.5, data: '2023-03-13' },
    { id: 3, studenteId: 3, materiaId: 1, scritto: 7.0, orale: 7.5, data: '2023-05-14' },
    { id: 4, studenteId: 4, materiaId: 2, scritto: 6.5, orale: 6.0, data: '2023-05-15' },
    { id: 5, studenteId: 5, materiaId: 1, scritto: 9.0, orale: 9.5, data: '2023-06-16' },
    { id: 6, studenteId: 6, materiaId: 3, scritto: 8.0, orale: 7.5, data: '2023-06-17' },
    { id: 7, studenteId: 7, materiaId: 1, scritto: 7.5, orale: 8.0, data: '2023-06-18' },
    { id: 8, studenteId: 8, materiaId: 3, scritto: 9.0, orale: 9.5, data: '2023-06-19' },
    { id: 9, studenteId: 9, materiaId: 1, scritto: 8.5, orale: 8.0, data: '2023-06-20' },
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
    { id: 1, nome: 'Lucia', cognome: 'Verdi', materia: 'Matematica', scuolaId: 1, email: 'lucia@verdi', password: 'lucia123' },
    { id: 2, nome: 'Giovanni', cognome: 'Neri', materia: 'Italiano', scuolaId: 2, email: 'giovanni@neri', password: 'giovanni123' },
    { id: 3, nome: 'Paolo', cognome: 'Bianchi', materia: 'Matematica', scuolaId: 1, email: 'paolo@bianchi', password: 'paolo123' },
    { id: 4, nome: 'Anna', cognome: 'Rossi', materia: 'Italiano', scuolaId: 2, email: 'anna@rossi', password: 'anna123' },
    { id: 5, nome: 'Chiara', cognome: 'Gallo', materia: 'Scienze', scuolaId: 1, email: 'chiara@gallo', password: 'chiara123' },
    { id: 6, nome: 'Marco', cognome: 'Bianchi', materia: 'Matematica', scuolaId: 1, email: 'marco@bianchi', password: 'marco123' },
    { id: 7, nome: 'Marco', cognome: 'Gialli', materia: 'Ed.Fisica', scuolaId: 1, email: 'marco@gialli', password: 'marco123' },
    { id: 8, nome: 'Stefania', cognome: 'Verdi', materia: 'Educazione Fisica', scuolaId: 1, email: 'stefania@verdi', password: 'stefania123' },
];

// Presenze
export const presenze = [
    { id: 1, studenteId: 1, data: '2023-09-14', stato: 'Presente', orarioEntrata: '08:00', orarioUscita: '13:00' },
    { id: 2, studenteId: 2, data: '2023-09-14', stato: 'Assente', orarioEntrata: '00:00', orarioUscita: '00:00' },
    { id: 3, studenteId: 3, data: '2023-09-15', stato: 'Presente', orarioEntrata: '08:00', orarioUscita: '12:30' },
    { id: 4, studenteId: 4, data: '2023-09-15', stato: 'Presente', orarioEntrata: '08:30', orarioUscita: '12:00' },
    { id: 5, studenteId: 5, data: '2023-09-16', stato: 'Assente', orarioEntrata: '00:00', orarioUscita: '00:00' },
    { id: 6, studenteId: 6, data: '2023-09-16', stato: 'Presente', orarioEntrata: '08:00', orarioUscita: '13:00' },
];

// Orari Lezione
export const orariLezione = [
    { id: 1, materiaId: 1, insegnanteId: 1, classeId: 1, scuolaId: 1, giorno: 'Lunedi', oraInizio: '08:00', oraFine: '09:00' },
    { id: 2, materiaId: 2, insegnanteId: 2, classeId: 2, scuolaId: 2, giorno: 'Martedi', oraInizio: '10:00', oraFine: '11:00' },
    { id: 3, materiaId: 3, insegnanteId: 5, classeId: 1, scuolaId: 1, giorno: 'Mercoledi', oraInizio: '09:00', oraFine: '10:00' },
    { id: 4, materiaId: 4, insegnanteId: 8, classeId: 1, scuolaId: 1, giorno: 'Giovedi', oraInizio: '08:30', oraFine: '09:30' },
    { id: 5, materiaId: 1, insegnanteId: 3, classeId: 3, scuolaId: 1, giorno: 'Venerdi', oraInizio: '11:00', oraFine: '12:00' },
];
