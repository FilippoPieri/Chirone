
import { useState } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import ClassSelector from './ClassSelector';
import Registro from './Registro.jsx';
import InserimentoVoti from './InserimentoVoti.jsx'; // Importiamo il nuovo componente per inserire i voti
import OrarioLezioni from './OrarioLezioni.jsx';
import '../css/Features.css';

function Features({ loggedIn }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null); // Aggiunta di una variabile di stato per distinguere le feature

  if (!loggedIn) {
    return <p>Devi effettuare il login per accedere alle funzionalità.</p>;
  }
  
  const handleRegistroClick = () => {
    setSelectedFeature('registro'); // Quando clicchi su "Registro", imposti la feature selezionata
    setShowClassSelector(true); // Mostra il selettore di classi
    setSelectedClass(null); // Resetta la classe selezionata
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
        {showClassSelector && !selectedClass && (
          <ClassSelector onClassSelect={setSelectedClass} /> // Mostra il selettore di classi
        )}

        {/* Mostra il componente Registro se "Registro" è stato selezionato */}
        {selectedClass && selectedFeature === 'registro' && (
          <Registro selectedClass={selectedClass} />
        )}

        {/* Mostra il componente InserimentoVoti se "Inserimento Voti" è stato selezionato */}
        {selectedClass && selectedFeature === 'voti' && (
          <InserimentoVoti selectedClass={selectedClass} />
        )}

        {/* Mostra il componente OrarioLezioni se "Orario Lezioni" è stato selezionato */}
        {selectedClass && selectedFeature === 'orario' && (
          <OrarioLezioni selectedClass={selectedClass} />
        )}
      </div>
    </section>
  );
}

// Definiamo i PropTypes per validare le props
Features.propTypes = {
  loggedIn: PropTypes.bool.isRequired // `loggedIn` deve essere un booleano ed è obbligatorio
};

export default Features;