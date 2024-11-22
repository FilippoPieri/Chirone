import '../css/App.css';
import '../css/Header.css';
import '../css/Intro.css';
import '../css/Features.css';
import '../css/Footer.css';
import { useState, useEffect } from 'react';
import Header from './Header';
import Intro from './Intro';
import Footer from './Footer';
import Features from './Features'; // Ora il componente Features è per insegnanti
import FeaturesStudenti from './FeaturesStudenti'; // Componente per studenti

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Stato del login
  const [utenteLoggato, setUtenteLoggato] = useState(null); // Stato dell'utente loggato

  useEffect(() => {
      // Recupera token e dati dell'utente dal localStorage all'avvio
      const token = localStorage.getItem('token');
      const utente = JSON.parse(localStorage.getItem('utenteLoggato'));

      if (token && utente) {
          setLoggedIn(true);
          setUtenteLoggato(utente);
      }

      // Listener per il logout automatico alla chiusura della scheda
      window.addEventListener('beforeunload', handleLogout);

      return () => {
          window.removeEventListener('beforeunload', handleLogout);
      };
  }, []);

  const handleLogout = () => {
      console.log('Session ended');
      // Rimuove il token di accesso e refresh dal localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      localStorage.removeItem('utenteLoggato');
      setLoggedIn(false);
      setUtenteLoggato(null);
  };

  console.log('Utente loggato:', utenteLoggato);


  return (
    <div className="App">
        <Header />
        <main>
            <Intro
                setLoggedIn={setLoggedIn}
                loggedIn={loggedIn}
                setUtenteLoggato={(utente) => {
                    setUtenteLoggato(utente);
                    localStorage.setItem('utenteLoggato', JSON.stringify(utente));
                }}
                utenteLoggato={utenteLoggato}
                handleLogout={handleLogout} // Passa il logout ad Intro
            />
            {loggedIn && utenteLoggato ? (
                utenteLoggato.ruolo === 'insegnante' ? (
                    <Features utenteLoggato={utenteLoggato} />
                ) : (
                    <FeaturesStudenti utenteLoggato={utenteLoggato} />
                )
            ) : (
                <p>Effettua il login per accedere alle funzionalità.</p>
            )}
        </main>
        <Footer />
    </div>
);
}

export default App;