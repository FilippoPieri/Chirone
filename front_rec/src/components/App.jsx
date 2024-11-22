import '../css/App.css';
import '../css/Header.css';
import '../css/Intro.css';
import '../css/Features.css';
import '../css/Footer.css';
import { useState, useEffect } from 'react';
import Header from './Header';
import Intro from './Intro';
import Footer from './Footer';
import Features from './Features'; // Componente per insegnanti
import FeaturesStudenti from './FeaturesStudenti'; // Componente per studenti

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [utenteLoggato, setUtenteLoggato] = useState(null);

    useEffect(() => {
        // Recupera token e dati dell'utente dal localStorage all'avvio
        const token = localStorage.getItem('token');
        const utente = JSON.parse(localStorage.getItem('utenteLoggato'));

        if (token && utente) {
            setLoggedIn(true);
            setUtenteLoggato(utente);
        }
    }, []);

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
