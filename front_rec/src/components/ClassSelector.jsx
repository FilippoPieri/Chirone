import PropTypes from "prop-types";
import { classi } from './mockdb'; // Importa le classi dal mockdb
import '../css/ClassSelector.css';

function ClassSelector({ onClassSelect }) {
  return (
    <div className="class-list">
      {classi.map(classe => (
        <div key={classe.id} className="class-block" onClick={() => onClassSelect(classe)}>
          <h4>{classe.anno}{classe.sezione}</h4>
          <p>Classe della scuola {classe.scuolaId}</p>
        </div>
      ))}
    </div>
  );
}

// Aggiungi la validazione delle proprietà qui
ClassSelector.propTypes = {
  onClassSelect: PropTypes.func.isRequired, // Specifica che onClassSelect deve essere una funzione e è obbligatorio
};

export default ClassSelector;