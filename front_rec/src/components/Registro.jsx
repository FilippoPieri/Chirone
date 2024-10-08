import PropTypes from "prop-types";
import { useState } from 'react';
import '../css/Registro.css';
import { studenti, presenze } from './mockdb';

function Registro({ selectedClass }) {
  const [statoPresenze, setStatoPresenze] = useState({}); // Stato per memorizzare le presenze degli studenti

  const getStudentsWithDetails = (classeId) => {
    return studenti
      .filter(studente => studente.classeId === classeId)
      .map(studente => ({
        ...studente,
        presenze: presenze.filter(presenza => presenza.studenteId === studente.id)
      }));
  };

  const studentiConDettagli = getStudentsWithDetails(selectedClass.id);

  // Funzione per aggiornare lo stato di presenza di uno studente
  const handlePresenzaChange = (studenteId, presenza) => {
    setStatoPresenze({
      ...statoPresenze,
      [studenteId]: presenza
    });
  };

  return (
    <div className="class-details">
      <h3>Registro della classe {selectedClass.anno}{selectedClass.sezione}</h3>
      
      <table className="registro-table">
        <thead>
          <tr>
            <th>Studente</th>
            <th>Data di nascita</th>
            <th>Presenza</th>
            <th>Entrata in Ritardo</th>
            <th>Uscita anticipata</th> 
          </tr>
        </thead>
        <tbody>
          {studentiConDettagli.map(studente => {
            const stato = statoPresenze[studente.id] || "Presente";
            const rigaClasse = stato === "Presente" ? 'riga-verde' : stato === "Assente" ? 'riga-rossa' : '';

            return (
              <tr key={studente.id} className={rigaClasse}>
                <td>{studente.nome} {studente.cognome}</td>
                <td>{studente.dataNascita}</td>
                <td>
                  {/* Select per la presenza */}
                  <select 
                    value={statoPresenze[studente.id] || 'Presente'}
                    onChange={(e) => handlePresenzaChange(studente.id, e.target.value)}
                  >
                    <option value="Presente">Presente</option>
                    <option value="Assente">Assente</option>
                  </select>
                </td>
                <td>
                  {/* Input per l'ora di entrata */}
                  <input type="time" />
                </td>
                <td>
                  {/* Input per l'ora di uscita */}
                  <input type="time" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Aggiungi la validazione delle proprietà qui
Registro.propTypes = {
  selectedClass: PropTypes.shape({
      id: PropTypes.string.isRequired, // O il tipo appropriato
      anno: PropTypes.string.isRequired, // O il tipo appropriato
      sezione: PropTypes.string.isRequired, // O il tipo appropriato
  }).isRequired, // Indica che selectedClass è obbligatorio
};

export default Registro;