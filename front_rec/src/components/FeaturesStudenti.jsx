import { useState } from 'react';
import PropTypes from 'prop-types';
import RegistroStudente from './RegistroStudente';
import '../css/Features.css';

function FeaturesStudenti({ utenteLoggato }) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleRegistroClick = () => {
    setSelectedFeature('registro');
  };

  return (
    <section className="features-container">
      <div className="features-list">
        <div className="feature" onClick={handleRegistroClick}>
          <h3>Registro</h3>
          <p>Visualizza il tuo registro personale.</p>
        </div>
        {/* Puoi aggiungere altre funzionalità qui */}
      </div>

      <div className="features-content">
        {/* Se lo studente ha selezionato una feature, mostra il componente relativo */}
        {selectedFeature === 'registro' && (
          <RegistroStudente utenteLoggato={utenteLoggato} />
        )}
      </div>
    </section>
  );
}

FeaturesStudenti.propTypes = {
  utenteLoggato: PropTypes.shape({
    ruolo: PropTypes.string.isRequired,
    nome: PropTypes.string.isRequired,
    cognome: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeaturesStudenti;