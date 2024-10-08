// Comprensivi da eliminare
export const comprensivi = [
    {
        id: 1,
        nome: 'Comprensivo A',
        indirizzo: 'Via Roma 1',
        telefono: '1234567890',
    },
    {
        id: 2,
        nome: 'Comprensivo B',
        indirizzo: 'Via Milano 10',
        telefono: '0987654321',
    },
];

// Scuole
export const scuole = [
    {
        id: 1,
        nome: 'Scuola Elementare A',
        indirizzo: 'Via Roma 1',
        comprensivoId: 1,
    },
    {
        id: 2,
        nome: 'Scuola Media B',
        indirizzo: 'Via Milano 10',
        comprensivoId: 2,
    },
];

// Classi
export const classi = [
    {
        id: 1,
        sezione: 'A',
        anno: 1,
        scuolaId: 1,
    },
    {
        id: 2,
        sezione: 'B',
        anno: 2,
        scuolaId: 2,
    },
    {
        id: 3,
        sezione: 'C',
        anno: 3,
        scuolaId: 1,
    },
    {
        id: 4,
        sezione: 'D',
        anno: 1,
        scuolaId: 2,
    },
    {
        id: 5,
        sezione: 'E',
        anno: 3,
        scuolaId: 1,
    },
    {
        id: 6,
        sezione: 'F',
        anno: 2,
        scuolaId: 2,
    },
];

// Studenti
export const studenti = [
    {
        id: 1,
        nome: 'Mario',
        cognome: 'Rossi',
        dataNascita: '2010-06-15',
        classeId: 1,
    },
    {
        id: 2,
        nome: 'Giulia',
        cognome: 'Bianchi',
        dataNascita: '2009-09-21',
        classeId: 2,
    },
    {
        id: 3,
        nome: 'Luca',
        cognome: 'Verdi',
        dataNascita: '2011-01-12',
        classeId: 1,
    },
    {
        id: 4,
        nome: 'Sofia',
        cognome: 'Neri',
        dataNascita: '2010-03-05',
        classeId: 2,
    },
    {
        id: 5,
        nome: 'Marco',
        cognome: 'Gialli',
        dataNascita: '2012-08-22',
        classeId: 3,
    },
    {
        id: 6,
        nome: 'Alice',
        cognome: 'Blu',
        dataNascita: '2011-11-14',
        classeId: 4,
    },
    {
        id: 7,
        nome: 'Davide',
        cognome: 'Marroni',
        dataNascita: '2010-09-11',
        classeId: 5,
    },
    {
        id: 8,
        nome: 'Sara',
        cognome: 'Viola',
        dataNascita: '2009-02-13',
        classeId: 6,
    },
];

// Insegnanti
export const insegnanti = [
    {
        id: 1,
        nome: 'Lucia',
        cognome: 'Verdi',
        materia: 'Matematica',
        scuolaId: 1,
        email: 'lucia@verdi',
        password: 'lucia123',
    },
    {
        id: 2,
        nome: 'Giovanni',
        cognome: 'Neri',
        materia: 'Italiano',
        scuolaId: 2,
        email: 'giovanni@neri',
        password: 'giovanni123',
    },
    {
        id: 3,
        nome: 'Paolo',
        cognome: 'Bianchi',
        materia: 'Matematica',
        scuolaId: 1,
        email: 'paolo@bianchi',
        password: 'paolo123',
    },
    {
        id: 4,
        nome: 'Anna',
        cognome: 'Rossi',
        materia: 'Italiano',
        scuolaId: 2,
        email: 'anna@rossi',
        password: 'anna123',
    },
    {
        id: 5,
        nome: 'Chiara',
        cognome: 'Gallo',
        materia: 'Scienze',
        scuolaId: 1,
        email: 'chiara@gallo',
        password: 'chiara123',
    },
    {
        id: 6,
        nome: 'Marco',
        cognome: 'Bianchi',
        materia: 'Matematica',
        scuolaId: 1,
        email: 'marco@bianchi',
        password: 'marco123',
    },
];

// Materie
export const materie = [
    {
        id: 1,
        nomeMateria: 'Matematica',
        insegnanteId: 1,
        classiIds: [1, 3], // Lucia insegna matematica in 1A e 3C
    },
    {
        id: 2,
        nomeMateria: 'Matematica',
        insegnanteId: 3,
        classiIds: [5], // Paolo insegna matematica in 3E
    },
    {
        id: 3,
        nomeMateria: 'Matematica',
        insegnanteId: 6,
        classiIds: [1], // Marco insegna matematica in 1A
    },
    {
        id: 4,
        nomeMateria: 'Italiano',
        insegnanteId: 2,
        classiIds: [2, 4], // Giovanni insegna italiano in 2B e 1D
    },
    {
        id: 5,
        nomeMateria: 'Italiano',
        insegnanteId: 4,
        classiIds: [6], // Anna insegna italiano in 2F
    },
    {
        id: 6,
        nomeMateria: 'Scienze',
        insegnanteId: 5,
        classiIds: [1, 5], // Chiara insegna scienze in 1A e 3E
    },
];

// Voti
export const voti = [
    {
        id: 1,
        studenteId: 1,
        materiaId: 1,
        voto: 8.5,
        data: '2023-03-12',
    },
    {
        id: 2,
        studenteId: 2,
        materiaId: 4,
        voto: 9.0,
        data: '2023-03-13',
    },
    {
        id: 3,
        studenteId: 3,
        materiaId: 1,
        voto: 7.0,
        data: '2023-05-14',
    },
    {
        id: 4,
        studenteId: 4,
        materiaId: 4,
        voto: 6.5,
        data: '2023-05-15',
    },
    {
        id: 5,
        studenteId: 5,
        materiaId: 2,
        voto: 9.0,
        data: '2023-06-16',
    },
    {
        id: 6,
        studenteId: 6,
        materiaId: 5,
        voto: 8.0,
        data: '2023-06-17',
    },
    {
        id: 7,
        studenteId: 7,
        materiaId: 2,
        voto: 7.5,
        data: '2023-06-18',
    },
    {
        id: 8,
        studenteId: 8,
        materiaId: 5,
        voto: 9.0,
        data: '2023-06-19',
    },
];

// Presenze
export const presenze = [
    {
        id: 1,
        studenteId: 1,
        data: '2023-09-14',
        stato: 'Presente',
        orarioEntrata: '08:00',
        orarioUscita: '13:00',
    },
    {
        id: 2,
        studenteId: 2,
        data: '2023-09-14',
        stato: 'Assente',
        orarioEntrata: '00:00',
        orarioUscita: '00:00',
    },
    {
        id: 3,
        studenteId: 3,
        data: '2023-09-15',
        stato: 'Presente',
        orarioEntrata: '08:00',
        orarioUscita: '12:30',
    },
    {
        id: 4,
        studenteId: 4,
        data: '2023-09-15',
        stato: 'Presente',
        orarioEntrata: '08:30',
        orarioUscita: '12:00',
    },
    {
        id: 5,
        studenteId: 5,
        data: '2023-09-16',
        stato: 'Assente',
        orarioEntrata: '00:00',
        orarioUscita: '00:00',
    },
    {
        id: 6,
        studenteId: 6,
        data: '2023-09-16',
        stato: 'Presente',
        orarioEntrata: '08:00',
        orarioUscita: '13:00',
    },
];

// Orari Lezione
export const orariLezione = [
    {
        id: 1,
        materiaId: 1,
        insegnanteId: 1,
        classeId: 1,
        scuolaId: 1,
        giorno: 'Lunedi',
        oraInizio: '08:00',
        oraFine: '09:00',
    },
    {
        id: 2,
        materiaId: 4,
        insegnanteId: 2,
        classeId: 2,
        scuolaId: 2,
        giorno: 'Martedi',
        oraInizio: '10:00',
        oraFine: '11:00',
    },
    {
        id: 3,
        materiaId: 6,
        insegnanteId: 5,
        classeId: 1,
        scuolaId: 1,
        giorno: 'Mercoledi',
        oraInizio: '09:00',
        oraFine: '10:00',
    },
    {
        id: 4,
        materiaId: 1,
        insegnanteId: 1,
        classeId: 3,
        scuolaId: 1,
        giorno: 'Giovedi',
        oraInizio: '08:30',
        oraFine: '09:30',
    },
    {
        id: 5,
        materiaId: 2,
        insegnanteId: 3,
        classeId: 5,
        scuolaId: 1,
        giorno: 'Venerdi',
        oraInizio: '11:00',
        oraFine: '12:00',
    },
];
