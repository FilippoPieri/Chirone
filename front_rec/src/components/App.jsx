import '../css/App.css';
import '../css/Header.css';
import '../css/Intro.css';
import '../css/Features.css';
import '../css/Footer.css';
import { useState } from 'react';
import Header from './Header';
import Intro from './Intro';
import Features from './Features';
import Footer from './Footer';

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Stato per il login
  const [utenteLoggato, setUtenteLoggato] = useState(null); // Stato per l'utente loggato

  return (
    <div className="App">
      <Header />
      <main>
        <Intro 
          setLoggedIn={setLoggedIn} 
          loggedIn={loggedIn} 
          setUtenteLoggato={setUtenteLoggato} 
        />
        {/* Rendi Features visibile solo se utenteLoggato è definito */}
        {loggedIn && utenteLoggato ? (
          <Features 
            loggedIn={loggedIn} 
            utenteLoggato={utenteLoggato} 
          />
        ) : (
          <p>Effettua il login per accedere alle funzionalità.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;

