import PropTypes from "prop-types";
import { useState, useEffect } from 'react';
import '../css/Registro.css';
//import VisualizzaRegistro from './VisualizzaRegistro'; // Importa il nuovo componente

function Registro({ selectedClass }) {
  const [studentiClasse, setStudentiClasse] = useState([]);
  const [presenze, setPresenze] = useState({});

  useEffect(() => {
    async function fetchStudenti() {
      try {
        const response = await fetch(`http://localhost:8000/api/classi/${selectedClass.id}/studenti/`);
        const data = await response.json();
        setStudentiClasse(data.studenti);
        const initialPresenze = data.studenti.reduce((acc, studente) => {
          acc[studente.id] = { presente: true, entrata: '', uscita: '', giustificato: false };
          return acc;
        }, {});
        setPresenze(initialPresenze);
      } catch (error) {
        console.error("Errore nel fetch degli studenti:", error);
      }
    }

    if (selectedClass) {
      fetchStudenti();
    }
  }, [selectedClass]);

  const handlePresenceChange = (id) => {
    setPresenze(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        presente: !prev[id].presente
      }
    }));
  };

  const handleTimeChange = (id, time, type) => {
    setPresenze(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: time
      }
    }));
  };

  const handleJustifiedChange = (id, checked) => {
    setPresenze(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        giustificato: checked
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:8000/api/presenze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ presenze })
      });
    } catch (error) {
      console.error("Errore nell'invio delle presenze:", error);
    }
  };


  return (
    <div className="class-details">
      <h3>Registro della classe {selectedClass.anno}{selectedClass.sezione}</h3>
      <table className="registro-table">
        <thead>
          <tr>
            <th>Studente</th>
            <th>ID</th>
            <th>Presenza</th>
            <th>Entrata in Ritardo</th>
            <th>Uscita anticipata</th>
            <th>Giustificazione</th>
          </tr>
        </thead>
        <tbody>
          {studentiClasse.map(studente => (
            <tr key={studente.id}>
              <td>{studente.nome} {studente.cognome}</td>
              <td>
                <button onClick={() => handlePresenceChange(studente.id)}>
                  {presenze[studente.id].presente ? 'Presente' : 'Assente'}
                </button>
              </td>
              <td>
                <input
                  type="time"
                  value={presenze[studente.id].entrata}
                  onChange={(e) => handleTimeChange(studente.id, e.target.value, 'entrata')}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={presenze[studente.id].uscita}
                  onChange={(e) => handleTimeChange(studente.id, e.target.value, 'uscita')}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={presenze[studente.id].giustificato}
                  onChange={(e) => handleJustifiedChange(studente.id, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Invia Presenze</button>
    </div>
  );
}

// Definizione delle PropTypes
Registro.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Accetta sia stringa che numero
    sezione: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Registro;
