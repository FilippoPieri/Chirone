
import '../css/App.css';
import '../css/Header.css';
import '../css/Intro.css';
import '../css/Features.css';
import '../css/Footer.css';
import { useState } from 'react'; // Importa useState
import Header from './Header';
import Intro from './Intro';
import Features from './Features';
import Footer from './Footer';

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Stato per il login

  return (
    <div className="App"> {/* applica CSS di App.css su tutti gli elementi contenuti in body*/}
      <Header />
      <main>
      <Intro setLoggedIn={setLoggedIn} loggedIn={loggedIn} /> {/* Passiamo lo stato e il setState */}
      <Features loggedIn={loggedIn} /> {/* Passiamo lo stato di login */}
      </main>
      <Footer />
    </div>
  );
}

export default App;

