
import { useState } from 'react';
import ClassSelector from './ClassSelector';
import Registro from './Registro.jsx';
import '../css/Features.css';

function Features() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassSelector, setShowClassSelector] = useState(false);

  const handleRegistroClick = () => {
    setShowClassSelector(!showClassSelector);
    setSelectedClass(null);
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
        <div className="feature" onClick={() => handleClick('Agenda')}>
          <h3>Agenda</h3>
          <p>Inserisci le annotazioni riguardanti la classe.</p>
        </div>
        <div className="feature" onClick={() => handleClick('Inserimento Voti')}>
          <h3>Inserimento Voti</h3>
          <p>Inserisci e visualizza i voti degli studenti.</p>
        </div>
        <div className="feature" onClick={() => handleClick('Argomenti Trattati')}>
          <h3>Argomenti Trattati</h3>
          <p>Annota gli argomenti affrontati durante la lezione.</p>
        </div>
      </div>
      <div className="features-content">
        {showClassSelector && !selectedClass && (
          <ClassSelector onClassSelect={setSelectedClass} />
        )}
        {selectedClass && <Registro selectedClass={selectedClass} />}
      </div>
    </section>
  );
}

export default Features;