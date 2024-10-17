import PropTypes from 'prop-types';
import { presenze } from './mockdb'; // Assicurati di avere accesso ai dati delle presenze
import '../css/RegistroStudente.css'; // Crea un file CSS per gli stili personalizzati

function RegistroStudente({ utenteLoggato }) {
  const presenzeStudente = presenze.filter(presenza => presenza.studenteId === utenteLoggato.id);

  return (
    <div className="registro-studente">
      <h3>Registro di {utenteLoggato.nome} {utenteLoggato.cognome}</h3>
      <table className="registro-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Presenza</th>
            <th>Entrata in Ritardo</th>
            <th>Uscita Anticipata</th>
          </tr>
        </thead>
        <tbody>
          {presenzeStudente.length > 0 ? (
            presenzeStudente.map((presenza, index) => (
              <tr key={index}>
                <td>{presenza.data}</td>
                <td>{presenza.stato}</td>
                <td>{presenza.orarioEntrata || 'Nessuna'}</td>
                <td>{presenza.orarioUscita || 'Nessuna'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nessuna presenza registrata</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

RegistroStudente.propTypes = {
  utenteLoggato: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    cognome: PropTypes.string.isRequired,
  }).isRequired,
};

export default RegistroStudente;