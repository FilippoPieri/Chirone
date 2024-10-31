import PropTypes from "prop-types";
import { classi, materie } from './mockdb'; // Importa le classi  ematere dal mockdb
import '../css/ClassSelector.css';

function ClassSelector({ onClassSelect, insegnanteLoggato  }) {

  // Filtra le classi in base alle materie dell'insegnante loggato
  const classiFiltrate = classi.filter(classe =>
    materie.some(materia => materia.classiIds.includes(classe.id) && materia.insegnanteId === insegnanteLoggato.id)
  );

    return (
    <div className="class-list">
      {classiFiltrate.length > 0 ? (
        classiFiltrate.map(classe => (
          <div key={classe.id} className="class-block" onClick={() => onClassSelect(classe)}>
            <h4>{classe.anno}{classe.sezione}</h4>
            <p>Classe della scuola {classe.scuolaId}</p>
          </div>
        ))
      ) : (
        <p>Nessuna classe disponibile per questo insegnante.</p>
      )}
    </div>
  );
}

ClassSelector.propTypes = {
  onClassSelect: PropTypes.func.isRequired,
  insegnanteLoggato: PropTypes.shape({
    id: PropTypes.number,
  })
};

export default ClassSelector;