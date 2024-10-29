import { useState } from 'react';
import '../css/Intro.css';
import PropTypes from 'prop-types';

function Intro({ setLoggedIn, loggedIn, setUtenteLoggato, utenteLoggato }) {
  const [username, setUsername] = useState(''); // Stato per lo username
  const [password, setPassword] = useState(''); // Stato per memorizzare la password
  const [error, setError] = useState(''); // Stato per memorizzare l'errore

   // Funzione per gestire il login
   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }) // Invia username e password
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Salva il token nel localStorage
        setLoggedIn(true); // Imposta lo stato di login
        setUtenteLoggato({ username, ruolo: data.role }); // Imposta lo stato utente loggato, includendo il ruolo se fornito
        setError(''); // Reset dell'errore
      } else {
        setError('Credenziali non valide');
      }
    } catch (error) {
      setError('Errore di connessione');
    }
  };

  // Funzione per gestire il logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Rimuove il token dal localStorage
    setLoggedIn(false); // Reset dello stato di login
    setUtenteLoggato(null); // Reset dello stato utente loggato
    setUsername(''); // Reset del campo username
    setPassword(''); // Reset del campo password
  };

  return (
    <section className="intro">
      <h2>Accedi al Registro Scolastico Online</h2>

      {/* Se l'utente è loggato, mostra il messaggio di benvenuto e il pulsante per uscire */}
      {loggedIn ? (
        <div>
          <p>Benvenut* {utenteLoggato?.username}!</p>
          <button onClick={handleLogout} className="cta-button">Esci</button>
        </div>
      ) : (
        // Altrimenti, mostra il form di login
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Inserisci la tua username"
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="cta-button">Accedi</button>
        </form>
      )}
    </section>
  );
}

Intro.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  setUtenteLoggato: PropTypes.func.isRequired,
  utenteLoggato: PropTypes.shape({
    username: PropTypes.string,
    ruolo: PropTypes.string
  }),
};

export default Intro;