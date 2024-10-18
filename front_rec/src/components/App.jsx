import '../css/App.css';
import '../css/Header.css';
import '../css/Intro.css';
import '../css/Features.css';
import '../css/Footer.css';
import { useState } from 'react';
import Header from './Header';
import Intro from './Intro';
import Footer from './Footer';
import Features from './Features'; // Ora il componente Features è per insegnanti
import FeaturesStudenti from './FeaturesStudenti'; // Componente per studenti

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Stato del login
  const [utenteLoggato, setUtenteLoggato] = useState(null); // Stato dell'utente loggato

  return (
    <div className="App">
      <Header />
      <main>
        {/* Se l'utente non è loggato, mostra il componente di login */}
        <Intro 
          setLoggedIn={setLoggedIn} 
          loggedIn={loggedIn} 
          setUtenteLoggato={setUtenteLoggato} 
          utenteLoggato={utenteLoggato}
        />

        {/* Se l'utente è loggato, mostra il componente corretto */}
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