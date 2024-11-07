import PropTypes from "prop-types";
import { useState, useEffect } from 'react';
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
  
      const token = localStorage.getItem('token');  // Assicurati che questo sia il nome corretto per la chiave del token
      console.log('Token inviato con la richiesta:', localStorage.getItem('token'));
      
      const headers = new Headers({
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
      });
  
      try {
            const response = await fetch(`http://localhost:8000/api/classes/${selectedClass.id}/students/`, { headers });
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }
            const data = await response.json();
            console.log("Risposta completa:", data); // Aggiungi questa riga per vedere l'output di 'data'
            // Verifica che `data.studenti` esista e sia un array
                if (Array.isArray(data.students)) {
                    setStudentiClasse(data.students);
        
                    // Inizializzazione dei dati di presenza per ciascuno studente
                    const initialPresenze = data.students.reduce((acc, studente) => {
                    acc[studente.id] = { presente: true, entrata: '', uscita: '', giustificato: false };
                    return acc;
                }, {});
                setPresenze(initialPresenze);
            } else {
                setError("La risposta del server non contiene una lista di studenti valida.");
            }
      } catch (err) {
          console.error("Failed to fetch students:", err);
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
    const token = localStorage.getItem('token'); // Recupera il token salvato

    const presenzeData = Object.keys(presenze).map((studenteId) => {
        const { presente, entrata, uscita, giustificato } = presenze[studenteId];
        return {
            studente: parseInt(studenteId),
            data: "2024-11-07", // Imposta la data o usa una variabile per la data dinamica
            stato: presente ? "presente" : "assente",
            entrata_ritardo: entrata || null,
            uscita_anticipata: uscita || null,
            giustificazione: giustificato
        };
    });

    try {
        const response = await fetch('http://localhost:8000/api/presenze/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({ presenze: presenzeData })
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
        <h3>Registro della classe {selectedClass.anno}{selectedClass.sezione}</h3>

        {/* Pulsante per visualizzare il registro dettagliato */}
        <button onClick={() => setShowDettagli(!showDettagli)} className="dettagli-btn">
          {showDettagli ? "Nascondi Registro Dettagliato" : "Visualizza Registro Dettagliato"}
        </button>
        
        {showDettagli && <VisualizzaRegistro studenti={studentiClasse} />} {/* Mostra il componente VisualizzaRegistro se showDettagli è true */}

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
                    <tr
                        key={studente.id}
                        className={presenze[studente.id]?.presente ? 'row-presente' : 'row-assente'}
                    >
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
        <button onClick={handleSubmit}>Invia Presenze</button>
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