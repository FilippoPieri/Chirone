import { useState } from 'react';
import PropTypes from 'prop-types';
import RegistroStudente from './RegistroStudente';
import VotiStudente from './VotiStudente';
import OrarioStudente from './OrarioStudente';
import '../css/Features.css'; // CSS già presente

function FeaturesStudenti({ utenteLoggato }) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleRegistroClick = () => {
    setSelectedFeature('registro');
  };

  const handleVotiClick = () => {
    setSelectedFeature('voti');
  };

  const handleOrarioClick = () => {
    setSelectedFeature('orario');
  };

  return (
    <section className="features-container">
      <div className="features-list">
        <div className="feature" onClick={handleRegistroClick}>
          <h3>Registro</h3>
          <p>Visualizza il tuo registro personale.</p>
        </div>
        <div className="feature" onClick={handleVotiClick}>
          <h3>Voti</h3>
          <p>Visualizza i tuoi voti.</p>
        </div>
        <div className="feature" onClick={handleOrarioClick}>
          <h3>Orario</h3>
          <p>Visualizza il tuo orario settimanale.</p>
        </div>
      </div>

      <div className="features-content">
        {selectedFeature === 'registro' && (
          <RegistroStudente utenteLoggato={utenteLoggato} />
        )}

        {selectedFeature === 'voti' && (
          <VotiStudente utenteLoggato={utenteLoggato} />
        )}

        {selectedFeature === 'orario' && (
          <OrarioStudente utenteLoggato={utenteLoggato} />
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