
import { useState } from 'react';
import '../css/Header.css';
import { insegnanti } from './mockdb';

function Intro() {
  const [email, setEmail] = useState(''); // Stato per memorizzare l'email
  const [password, setPassword] = useState('');// Stato per memorizzare la password
  const [error, setError] = useState('');// Stato per memorizzare l'errore
  const [loggedIn, setLoggedIn] = useState(false); // Stato per memorizzare lo stato di login
  const [insegnanteLoggato, setInsegnanteLoggato] = useState(null); // Stato per memorizzare l'insegnante loggato

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cerca un insegnante con la stessa email e password nel database mockato
    const insegnante = insegnanti.find(
      (user) => user.email === email && user.password === password
    );

    if (insegnante) {
      // Login riuscito
      setLoggedIn(true); // Aggiorna lo stato di login
      setInsegnanteLoggato(insegnante); // mostra l'insegnante loggato
      setError(''); // Reset dell'errore
    } else {
      // Login fallito
      setError('Email o password errati');
    }
  };

  //gestione del log out
  const handleLogout = () =>{
    setLoggedIn(false);//reimposta lo stato di login rimettendolo a false
    setInsegnanteLoggato(null);//nasconde l'insegnante loggato  
    setEmail('');//reimposta l'email a vuoto
    setPassword('');//reimposta la password a vuoto
  };

  return (
    <section className="intro">
      <h2>Accedi al Registro Scolastico Online</h2>
      {loggedIn && insegnanteLoggato ? ( // Se il login è avvenuto, mostra il nome dell'insegnante e il pulsante "Esci"
        <div>
          <p>Benvenuto, {insegnanteLoggato.nome} {insegnanteLoggato.cognome}!</p>
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

export default Intro;