import { useState } from 'react';
import '../css/Intro.css';
import axios from 'axios';
import PropTypes from 'prop-types';

function Intro({ setLoggedIn, loggedIn, setUtenteLoggato, utenteLoggato }) {
  const [email, setEmail] = useState(''); // Stato per memorizzare l'email
  const [password, setPassword] = useState(''); // Stato per memorizzare la password
  const [error, setError] = useState(''); // Stato per memorizzare l'errore

  // Funzione per gestire il login
  const handleSubmit = async (e) => {
    e.preventDefault();  // Previene il comportamento predefinito del form

    try {
      // Effettua una chiamata POST all'API di login con axios
      const response = await axios.post('http://localhost:8000/api/login/', {
        email,  // Passiamo l'email
        password // Passiamo la password
      });

      // Se il login è andato a buon fine, imposta lo stato di login e salva i dati dell'utente
      if (response.data.success) {
        setLoggedIn(true);  // Imposta lo stato di login a true
        setUtenteLoggato(response.data.user);  // Memorizza i dati dell'utente loggato
        setError('');  // Reset dello stato di errore
      } else {
        // Mostra un messaggio di errore se le credenziali sono errate
        setError('Email o password errati');
      }
    } catch (error) {
      // Mostra un messaggio di errore in caso di problemi di connessione
      setError('Errore nella connessione al server');
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

      {/* Se l'utente è loggato, mostra il messaggio di benvenuto e il pulsante per uscire */}
      {loggedIn ? (
        <div>
          <p>Benvenuto {utenteLoggato?.nome} {utenteLoggato?.cognome}!</p>
          <button onClick={handleLogout} className="cta-button">Esci</button>
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
              onChange={(e) => setEmail(e.target.value)} // Aggiorna lo stato dell'email
              required
              placeholder="Inserisci la tua email"
              //autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Aggiorna lo stato della password
              required
              placeholder="Inserisci la tua password"
              //autoComplete="current-password"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostra il messaggio di errore */}
          <button type="submit" className="cta-button">Accedi</button>
        </form>
      )}
    </section>
  );
}

// Definizione delle PropTypes per la validazione
Intro.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,  // Funzione per impostare lo stato di login
  loggedIn: PropTypes.bool.isRequired,  // Stato del login
  setUtenteLoggato: PropTypes.func.isRequired,  // Funzione per impostare l'utente loggato
  utenteLoggato: PropTypes.shape({
    nome: PropTypes.string,
    cognome: PropTypes.string
  }),
};

export default Intro;