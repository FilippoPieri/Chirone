import PropTypes from "prop-types";
import { useState, useEffect } from 'react';
import { authFetch } from './authUtils'; // Modifica il percorso se necessario
import '../css/Registro.css';
import VisualizzaRegistro from './VisualizzaRegistro'; // Importa il nuovo componente

function Registro({ selectedClass }) {
  const [studentiClasse, setStudentiClasse] = useState([]);
  const [presenze, setPresenze] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDettagli, setShowDettagli] = useState(false); // Stato per mostrare o nascondere il componente VisualizzaRegistro

  useEffect(() => {
    const fetchStudenti = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await authFetch(`http://localhost:8000/api/classes/${selectedClass.id}/students/`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const data = await response.json();
        console.log("Risposta completa:", data);

        if (Array.isArray(data.students)) {
          setStudentiClasse(data.students);

          // Inizializzazione dei dati di presenza per ciascuno studente
          const initialPresenze = data.students.reduce((acc, studente) => {
            acc[studente.id] = {
              presente: true,
              entrata: '',
              uscita: '',
              giustificato: false,
            };
            return acc;
          }, {});
          setPresenze(initialPresenze);
        } else {
          setError("La risposta del server non contiene una lista di studenti valida.");
        }
      } catch (err) {
        console.error("Errore durante il fetch degli studenti:", err);
        setError(err.message || 'Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    if (selectedClass && selectedClass.id) {
      fetchStudenti();
    }
  }, [selectedClass]);

  const handlePresenceChange = (id) => {
    setPresenze((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        presente: !prev[id].presente,
      },
    }));
  };

  const handleTimeChange = (id, time, type) => {
    setPresenze((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: time,
      },
    }));
  };

  const handleJustifiedChange = (id, checked) => {
    setPresenze((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        giustificato: checked,
      },
    }));
  };

  const handleSubmit = async () => {
    const presenzeData = Object.keys(presenze).map((studenteId) => {
      const { presente, entrata, uscita, giustificato } = presenze[studenteId];
      return {
        studente_id: parseInt(studenteId), // Cambia "studente" in "studente_id"
        classe_id: selectedClass.id,  // Include l'ID della classe qui
        data: new Date().toISOString().split('T')[0], // Usa la data attuale
        stato: presente ? "presente" : "assente",
        entrata_ritardo: entrata || null,
        uscita_anticipata: uscita || null,
        giustificazione: giustificato,
      };
    });

    try {
      const response = await authFetch('http://localhost:8000/api/presenze/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presenze: presenzeData }),
      });

      if (!response.ok) {
        throw new Error('Errore nella risposta del server');
      }

      const data = await response.json();
      console.log("Risposta del server:", data);
    } catch (error) {
      console.error("Errore nell'invio delle presenze:", error);
    }
  };

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>Errore: {error}</p>;


return (
    <div className="class-details">
        <h3>Appello della classe {selectedClass.anno}{selectedClass.sezione}</h3>
  
        <table className="registro-table">
            <thead>
                <tr>
                    <th>Stato</th> {/* Nuova colonna per il pallino */}
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
                        <td>
                            <span
                                className={`stato-indicatore ${presenze[studente.id]?.presente ? 'stato-presente' : 'stato-assente'}`}
                            />
                        </td>
                        <td>{studente.nome} {studente.cognome}</td>
                        <td>{studente.username}</td>
                        <td>
                            <button
                                className={presenze[studente.id]?.presente ? 'presente-btn' : 'assente-btn'}
                                onClick={() => handlePresenceChange(studente.id)}
                            >
                                {presenze[studente.id]?.presente ? 'Presente' : 'Assente'}
                            </button>
                        </td>
                        <td>
                            <input
                                type="time"
                                value={presenze[studente.id]?.entrata || ""}
                                onChange={(e) => handleTimeChange(studente.id, e.target.value, 'entrata')}
                            />
                        </td>
                        <td>
                            <input
                                type="time"
                                value={presenze[studente.id]?.uscita || ""}
                                onChange={(e) => handleTimeChange(studente.id, e.target.value, 'uscita')}
                            />
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                checked={presenze[studente.id]?.giustificato || false}
                                onChange={(e) => handleJustifiedChange(studente.id, e.target.checked)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="button-container">
            <div className="left-button">
                <button onClick={handleSubmit}>Invia Presenze</button>
            </div>
            <div className="right-button">
                <button onClick={() => setShowDettagli(!showDettagli)} className="dettagli-btn">
                    {showDettagli ? "Nascondi Appello Dettagliato" : "Visualizza Appello Dettagliato"}
                </button>
            </div>
        </div>
        {showDettagli && <VisualizzaRegistro selectedClass={selectedClass} />}
    </div>
  );
} 

Registro.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sezione: PropTypes.string.isRequired
  }).isRequired,
};

export default Registro;