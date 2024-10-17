import { useState } from 'react';
import '../css/Intro.css';
import { insegnanti, studenti } from './mockdb';
import PropTypes from 'prop-types';

function Intro({ setLoggedIn, loggedIn, setUtenteLoggato, utenteLoggato }) {
  const [email, setEmail] = useState(''); // Stato per memorizzare l'email
  const [password, setPassword] = useState(''); // Stato per memorizzare la password
  const [error, setError] = useState(''); // Stato per memorizzare l'errore

  // Funzione per gestire il login
  const handleSubmit = (e) => {
    e.preventDefault();

    // Cerca l'utente sia tra insegnanti che studenti
    const utente = insegnanti.find(user => user.email === email && user.password === password) 
                || studenti.find(user => user.email === email && user.password === password);

    if (utente) {
      // Login riuscito
      setLoggedIn(true); // Aggiorna lo stato di login nel componente genitore (App)
      setUtenteLoggato(utente); // Memorizza l'utente loggato (insegnante o studente)
      setError(''); // Reset dell'errore
    } else {
      // Login fallito
      setError('Email o password errati');
    }
  };

  // Funzione per gestire il logout
  const handleLogout = () => {
    setLoggedIn(false); // Reimposta lo stato di login nel componente genitore
    setUtenteLoggato(null); // Svuota l'utente loggato
    setEmail(''); // Reimposta il campo email
    setPassword(''); // Reimposta il campo password
  };

  return (
    <section className="intro">
      <h2>Accedi al Registro Scolastico Online</h2>
      {loggedIn ? (
        // Se l'utente è loggato, mostra il messaggio di benvenuto e il pulsante per uscire
        <div>
          <p>Benvenuto, {utenteLoggato?.nome} {utenteLoggato?.cognome}!</p>
          <button onClick={handleLogout} className="cta-button">Esci</button> {/* Bottone per il logout */}
        </div>
      ) : (
        // Altrimenti, mostra il form di login
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Inserisci la tua email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Inserisci la tua password"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostra errore se email o password sono errati */}
          <button type="submit" className="cta-button">Accedi</button>
        </form>
      )}
    </section>
  );
}

// Definizione delle PropTypes
Intro.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  setUtenteLoggato: PropTypes.func.isRequired,
  utenteLoggato: PropTypes.shape({
    nome: PropTypes.string,
    cognome: PropTypes.string
  }),
};

export default Intro;