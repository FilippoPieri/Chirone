import { useState } from 'react';
import PropTypes from 'prop-types';
import ClassSelector from './ClassSelector';
import Registro from './Registro';
import InserimentoVoti from './InserimentoVoti';
import OrarioLezioni from './OrarioLezioni';
import { presenze } from './mockdb'; // Importiamo il mockdb dove salviamo i dati delle presenze
import '../css/Features.css';

function Features() { 
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleRegistroClick = () => {
    setSelectedFeature('registro');
    setSelectedClass(null); // Resetta la classe selezionata
  };

  const handleVotiClick = () => {
    setSelectedFeature('voti');
    setSelectedClass(null);
  };

  const handleOrarioClick = () => {
    setSelectedFeature('orario');
    setSelectedClass(null);
  };

  const handleBackClick = () => {
    setSelectedFeature(null); // Torna alla schermata principale
    setSelectedClass(null); // Resetta la classe selezionata
  };

   // Definizione della funzione handleSubmit
   const handleSubmit = (data) => {
    // Aggiorna il mock database delle presenze
    data.forEach((presenza) => {
      presenze.push({
        id: presenze.length + 1, // Genera un nuovo ID per ogni presenza
        studenteId: presenza.studenteId,
        data: new Date().toISOString().split('T')[0], // Data odierna
        stato: presenza.presenza,
        orarioEntrata: presenza.entrataRitardo || 'N/A',
        orarioUscita: presenza.uscitaAnticipata || 'N/A'
      });
    });

    console.log("Dati inviati e salvati nel mock database:", presenze);
  };

  return (
    <section className="features-container">
      <div className="features-list">
        <div className="feature" onClick={handleRegistroClick}>
          <h3>Registro</h3>
          <p>Gestisci il registro della classe.</p>
        </div>
        <div className="feature" onClick={handleVotiClick}>
          <h3>Inserimento Voti</h3>
          <p>Inserisci i voti degli studenti.</p>
        </div>
        <div className="feature" onClick={handleOrarioClick}>
          <h3>Orario Lezioni</h3>
          <p>Gestisci l&#39;orario delle lezioni.</p>
        </div>
        <div className="feature" onClick={handleOrarioClick}>
          <h3>Agenda</h3>
          <p>Note,Compiti,Ecc...</p>
        </div>
        <div className="feature" onClick={handleOrarioClick}>
          <h3>Argomenti trattati</h3>
          <p>Argomenti trattati dall&#39;insegnante</p>
        </div>
      </div>

      <div className="features-content">
        {/* Mostra il pulsante "Torna indietro" solo se una feature è stata selezionata */}
        {selectedFeature && !selectedClass && (
          <>
            <button onClick={handleBackClick} className="back-button">← Torna indietro</button>
            <ClassSelector onClassSelect={setSelectedClass} />
          </>
        )}

        {/* Mostra il componente Registro solo dopo aver selezionato una classe */}
        {selectedClass && selectedFeature === 'registro' && (
          <Registro selectedClass={{ ...selectedClass, anno: String(selectedClass.anno) }} onSubmit={handleSubmit} />
        )}

        {/* Mostra il componente Inserimento Voti solo dopo aver selezionato una classe */}
        {selectedClass && selectedFeature === 'voti' && (
          <InserimentoVoti selectedClass={{ ...selectedClass, anno: String(selectedClass.anno) }} />
        )}

        {/* Mostra il componente Orario Lezioni solo dopo aver selezionato una classe */}
        {selectedClass && selectedFeature === 'orario' && (
          <OrarioLezioni selectedClass={{ ...selectedClass, anno: String(selectedClass.anno) }} />
        )}
      </div>
    </section>
  );
}

Features.propTypes = {
  utenteLoggato: PropTypes.shape({
    ruolo: PropTypes.string.isRequired,
    nome: PropTypes.string.isRequired,
    cognome: PropTypes.string.isRequired,
  }).isRequired,
};

export default Features;