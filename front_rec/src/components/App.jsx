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
    // Aggiungi un listener per il logout automatico alla chiusura della scheda
    window.addEventListener('beforeunload', handleLogout);

    return () => {
      window.removeEventListener('beforeunload', handleLogout);
    };
  }, []);

  const handleLogout = () => {
    console.log('Session ended');
    // Rimuove il token di accesso e refresh dal localStorage
    localStorage.removeItem('token');
    setLoggedIn(false);
    setUtenteLoggato(null);
  };
  console.log('Utente loggato:', utenteLoggato, 'puppu');

  return (
    <div className="App">
      <Header />
      <main>
        <Intro
          setLoggedIn={setLoggedIn}
          loggedIn={loggedIn}
          setUtenteLoggato={setUtenteLoggato}
          utenteLoggato={utenteLoggato}
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
