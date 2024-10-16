import { useState } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import ClassSelector from './ClassSelector';
import Registro from './Registro.jsx';
import InserimentoVoti from './InserimentoVoti.jsx'; // Importiamo il nuovo componente per inserire i voti
import OrarioLezioni from './OrarioLezioni.jsx';
import '../css/Features.css';

function Features({ loggedIn, utenteLoggato }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null); // Aggiunta di una variabile di stato per distinguere le feature

  if (!loggedIn) {
    return <p>Devi effettuare il login per accedere alle funzionalità.</p>;
  }

  const handleRegistroClick = () => {
    setSelectedFeature('registro');
    setShowClassSelector(true);
    setSelectedClass(null);
  };

  const handleVotiClick = () => {
    setSelectedFeature('voti'); // Quando clicchi su "Inserimento Voti", imposti la feature selezionata
    setShowClassSelector(true); // Mostra il selettore di classi
    setSelectedClass(null); // Resetta la classe selezionata
  };

  const handleOrarioClick = () => {
    setSelectedFeature('orario'); // Quando clicchi su "OrarioLezioni", imposti la feature selezionata
    setShowClassSelector(true); // Mostra il selettore di classi
    setSelectedClass(null); // Resetta la classe selezionata
  };

  const handleClick = (feature) => {
    alert(`Hai cliccato su: ${feature}`);
  };

  return (
    <section className="features-container">
      <div className="features-list">
        <div className="feature" onClick={handleRegistroClick}>
          <h3>Registro</h3>
          <p>Gestisci rapidamente il registro scolastico.</p>
        </div>
        <div className="feature" onClick={handleVotiClick}>
          <h3>Inserimento Voti</h3>
          <p>Inserisci e visualizza i voti degli studenti.</p>
        </div>
        <div className="feature" onClick={handleOrarioClick}>
          <h3>Orario Lezioni</h3>
          <p>Visualizza l&#39;orario delle lezioni.</p>
        </div>
        <div className="feature" onClick={() => handleClick('Agenda')}>
          <h3>Agenda</h3>
          <p>Inserisci le annotazioni riguardanti la classe.</p>
        </div>
        <div className="feature" onClick={() => handleClick('Argomenti Trattati')}>
          <h3>Argomenti Trattati</h3>
          <p>Annota gli argomenti affrontati durante la lezione.</p>
        </div>
      </div>

      <div className="features-content">
        {/* Selezione della classe per insegnanti */}
        {showClassSelector && !selectedClass && utenteLoggato.ruolo === 'insegnante' && (
          <ClassSelector onClassSelect={setSelectedClass} />
        )}

        {/* Registro per lo studente loggato */}
        {utenteLoggato?.ruolo === 'studente' && selectedFeature === 'registro' && (
          <Registro selectedClass={utenteLoggato.classeId} />
        )}

        {/* Registro per l'insegnante con la selezione di classe */}
        {selectedClass && utenteLoggato?.ruolo === 'insegnante' && selectedFeature === 'registro' && (
          <Registro selectedClass={selectedClass} />
        )}

        {/* Inserimento voti per l'insegnante */}
        {selectedClass && selectedFeature === 'voti' && (
          <InserimentoVoti selectedClass={selectedClass} />
        )}

        {/* Visualizzazione orario lezioni */}
        {selectedClass && selectedFeature === 'orario' && (
          <OrarioLezioni selectedClass={selectedClass} />
        )}
      </div>
    </section>
  );
}

// Definizione delle PropTypes con `utenteLoggato` richiesto
Features.propTypes = {
  loggedIn: PropTypes.bool.isRequired,  // Obbligatorio che `loggedIn` sia booleano
  utenteLoggato: PropTypes.shape({      // Definizione di `utenteLoggato`
    ruolo: PropTypes.string.isRequired, // Il ruolo dell'utente (studente o insegnante) è obbligatorio
    nome: PropTypes.string.isRequired,  // Nome dell'utente obbligatorio
    cognome: PropTypes.string.isRequired, // Cognome dell'utente obbligatorio
    classeId: PropTypes.number,         // ID della classe dello studente (opzionale per insegnanti)
  }).isRequired, // L'intero oggetto `utenteLoggato` è richiesto
};

export default Features;