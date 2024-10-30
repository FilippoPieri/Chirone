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
    const loginUrl = 'http://localhost:8000/api/login/';
  
    console.log("Username:", username);
    console.log("Password:", password);

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Salva il token nel localStorage
        setLoggedIn(true); // Aggiorna lo stato di loggedIn
        setUtenteLoggato({ 
          username: username, 
          nome: data.nome,  // Assumi che 'nome' venga inviato dal backend
          cognome: data.cognome, // Assumi che 'cognome' venga inviato dal backend
          ruolo: data.role 
        });
        setError('');
      } else {
        const errData = await response.json();  // Estrarre e mostrare il messaggio di errore specifico
        setError(errData.non_field_errors || 'Credenziali non valide');
      }
    } catch (error) {
      console.error('Errore di connessione o nel server:', error); //debug
    setError('Errore di connessione al server');
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
          <p>Benvenut* {utenteLoggato?.nome}{utenteLoggato?.cognome}!</p>
          <button onClick={handleLogout} className="cta-button">Esci</button>
        </div>
      ) : (
        // Altrimenti, mostra il form di login
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
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
    ruolo: PropTypes.string,
    nome: PropTypes.string,
    cognome: PropTypes.string
  }),
};

export default Intro;