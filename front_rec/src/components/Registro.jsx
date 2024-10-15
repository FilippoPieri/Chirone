import PropTypes from "prop-types";
import { useState } from 'react';
import '../css/Registro.css';
import { studenti, presenze } from './mockdb';
import VisualizzaRegistro from './VisualizzaRegistro'; // Importa il nuovo componente

function Registro({ selectedClass, onSubmit }) {
  const [statoPresenze, setStatoPresenze] = useState({});
  const [entrataRitardo, setEntrataRitardo] = useState({});
  const [uscitaAnticipata, setUscitaAnticipata] = useState({});
  const [mostraVisualizzaRegistro, setMostraVisualizzaRegistro] = useState(false);
  const [datiPresenze, setDatiPresenze] = useState([]); // Nuovo stato per i dati delle presenze

  const getStudentsWithDetails = (classeId) => {
    return studenti
      .filter(studente => studente.classeId === classeId)
      .map(studente => ({
        ...studente,
        presenze: presenze.filter(presenza => presenza.studenteId === studente.id)
      }));
  };

  const studentiConDettagli = getStudentsWithDetails(selectedClass.id);

  const handlePresenzaChange = (studenteId, presenza) => {
    setStatoPresenze({
      ...statoPresenze,
      [studenteId]: presenza
    });
  };

  const handleEntrataChange = (studenteId, time) => {
    setEntrataRitardo({
      ...entrataRitardo,
      [studenteId]: time
    });
  };

  const handleUscitaChange = (studenteId, time) => {
    setUscitaAnticipata({
      ...uscitaAnticipata,
      [studenteId]: time
    });
  };

  const handleSubmit = () => {
    const presenzeDaInviare = studentiConDettagli.map(studente => ({
      nome: studente.nome,
      cognome: studente.cognome,
      dataNascita: studente.dataNascita,
      presenza: statoPresenze[studente.id] || "Presente",
      entrataRitardo: entrataRitardo[studente.id] || "",
      uscitaAnticipata: uscitaAnticipata[studente.id] || ""
    }));

    // Salva i dati delle presenze nello stato
    setDatiPresenze(presenzeDaInviare);
    // Chiama la funzione onSubmit per inviare i dati
    onSubmit(presenzeDaInviare);
  };

  // Condizione per mostrare VisualizzaRegistro
  if (mostraVisualizzaRegistro) {
    return (
      <VisualizzaRegistro
        presenze={datiPresenze} // Passa i dati delle presenze inviati
        onBack={() => setMostraVisualizzaRegistro(false)} // Torna a Registro
      />
    );
  }

  return (
    <div className="class-details">
      <h3>Registro della classe {selectedClass.anno}{selectedClass.sezione}</h3>
      <button onClick={() => setMostraVisualizzaRegistro(true)}>Mostra Visualizza Registro</button>

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
                  <select 
                    value={statoPresenze[studente.id] || 'Presente'}
                    onChange={(e) => handlePresenzaChange(studente.id, e.target.value)}
                  >
                    <option value="Presente">Presente</option>
                    <option value="Assente">Assente</option>
                  </select>
                </td>
                <td>
                  <input 
                    type="time" 
                    onChange={(e) => handleEntrataChange(studente.id, e.target.value)} 
                  />
                </td>
                <td>
                  <input 
                    type="time" 
                    onChange={(e) => handleUscitaChange(studente.id, e.target.value)} 
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Firma</button>
    </div>
  );
}

// Validazione dei PropTypes
Registro.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.string.isRequired,
    anno: PropTypes.string.isRequired,
    sezione: PropTypes.string.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Registro;
