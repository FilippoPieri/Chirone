import PropTypes from "prop-types";

function VisualizzaRegistro({ presenze, onBack }) {
  return (
    <div className="visualizza-registro">
      <h3>Visualizzazione Registro</h3>
      <button onClick={onBack}>Torna al Registro</button>
      <table className="registro-table">
        <thead>
          <tr>
            <th>Studente</th>
            <th>Data di Nascita</th>
            <th>Presenza</th>
            <th>Entrata in Ritardo</th>
            <th>Uscita Anticipata</th>
            <th>Giustificazione</th>
          </tr>
        </thead>
        <tbody>
          {presenze.length > 0 ? (
            presenze.map((presenza, index) => (
              <tr key={index}>
                <td>{presenza.nome} {presenza.cognome}</td>
                <td>{presenza.dataNascita}</td>
                <td>{presenza.presenza}</td>
                <td>{presenza.entrataRitardo}</td>
                <td>{presenza.uscitaAnticipata}</td>
                <td>
                  {/* Mostra la giustificazione solo se confermata */}
                  {presenza.giustificazioneConfermata ? (
                    <span>Giustificato</span>
                  ) : (
                    <span>Non giustificato</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Nessun dato disponibile</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Validazione dei PropTypes
VisualizzaRegistro.propTypes = {
  presenze: PropTypes.arrayOf(
    PropTypes.shape({
      nome: PropTypes.string.isRequired,
      cognome: PropTypes.string.isRequired,
      dataNascita: PropTypes.string.isRequired,
      presenza: PropTypes.string.isRequired,
      entrataRitardo: PropTypes.string,
      uscitaAnticipata: PropTypes.string,
      giustificazioneConfermata: PropTypes.bool.isRequired, // Conferma giustificazione
    })
  ).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default VisualizzaRegistro;
