import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import VisualizzaVoti from './VisualizzaVoti';
import { authFetch } from './authUtils';
import '../css/InserimentoVoti.css';

function InserimentoVoti({ selectedClass }) {
  const [studentiClasse, setStudentiClasse] = useState([]);
  const [voti, setVoti] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMateriaId, setSelectedMateriaId] = useState(null);
  const [showVisualizzaVoti, setShowVisualizzaVoti] = useState(false);

  const votoOptions = [];
  for (let i = 0; i <= 10; i += 0.25) {
    let label = '';
    if (Number.isInteger(i)) {
      label = i.toString(); // per numeri interi, usa il numero (es. "0", "1", "2", ...)
    } else {
      const base = Math.floor(i);
      const decimal = i % 1;
      if (decimal === 0.25) {
        label = base.toString() + '+'; // per un quarto sopra il numero intero (es. "0+")
      } else if (decimal === 0.5) {
        label = base.toString() + '.5'; // per la metà (es. "0.5")
      } else if (decimal === 0.75) {
        label = (base + 1).toString() + '-'; // per un quarto sotto il successivo intero (es. "1-")
      }
    }
    votoOptions.push(<option key={i} value={i}>{label}</option>);
  }

  useEffect(() => {
    const fetchStudentsAndMateria = async () => {
      if (!selectedClass.id) return;
      setLoading(true);
      try {
        const responseStudents = await authFetch(`http://localhost:8000/api/classes/${selectedClass.id}/students/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!responseStudents.ok) {
          throw new Error(`Errore nel recupero degli studenti: ${responseStudents.status}`);
        }

        const dataStudents = await responseStudents.json();
        setStudentiClasse(dataStudents.students);

        const initialVoti = dataStudents.students.reduce((acc, studente) => ({
          ...acc,
          [studente.id]: { scritto: '', orale: '', appunti: '' }
        }), {});
        setVoti(initialVoti);

        const responseMateria = await authFetch('http://localhost:8000/api/insegnante/materie/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!responseMateria.ok) {
          throw new Error(`Errore nel recupero della materia: ${responseMateria.status}`);
        }

        const dataMateria = await responseMateria.json();
        if (dataMateria.materie && dataMateria.materie.length > 0) {
          setSelectedMateriaId(dataMateria.materie[0].id);
        } else {
          setError('Nessuna materia associata trovata.');
        }
      } catch (err) {
        console.error("Errore durante il fetch:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndMateria();
  }, [selectedClass]);

  const handleInputChange = (studenteId, field, value) => {
    setVoti(prev => ({
      ...prev,
      [studenteId]: {
        ...prev[studenteId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const votiData = Object.keys(voti).map(studenteId => ({
        studente: studenteId,
        scritto: voti[studenteId].scritto,
        orale: voti[studenteId].orale,
        appunti: voti[studenteId].appunti,
        materia: selectedMateriaId
      }));

      console.log("Payload inviato:", JSON.stringify(votiData));

      const response = await authFetch('http://localhost:8000/api/voto/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(votiData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Voti inviati con successo!');
      const resetVoti = studentiClasse.reduce((acc, studente) => ({
          ...acc,
          [studente.id]: { scritto: '', orale: '', appunti: '' }
      }), {});
      setVoti(resetVoti);
    } catch (error) {
      console.error('Errore durante l\'invio dei voti:', error);
    }
  };

  const toggleVisualizzaVoti = () => {
    setShowVisualizzaVoti(!showVisualizzaVoti);
  };

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div className="inserimento-voti">
      <h3>Gestione voti per la classe {selectedClass.anno}{selectedClass.sezione}</h3>
      
      <table className="registro-table">
        <thead>
          <tr>
            <th>Studente</th>
            <th>Voto scritto</th>
            <th>Voto orale</th>
            <th>Appunti</th>
          </tr>
        </thead>
        <tbody>
          {studentiClasse.map(studente => (
            <tr key={studente.id}>
              <td>{studente.nome} {studente.cognome}</td>
              <td>
                <select
                  value={voti[studente.id].scritto}
                  onChange={(e) => handleInputChange(studente.id, 'scritto', e.target.value)}
                >
                  {votoOptions}
                </select>
              </td>
              <td>
                <select
                  value={voti[studente.id].orale}
                  onChange={(e) => handleInputChange(studente.id, 'orale', e.target.value)}
                >
                  {votoOptions}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Aggiungi appunti"
                  name={`appunti-${studente.id}`}
                  id={`appunti-${studente.id}`}
                  value={voti[studente.id].appunti}
                  onChange={(e) => handleInputChange(studente.id, 'appunti', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="actions">
        <button onClick={handleSubmit} className="submit-btn">Invia Tutti i Voti</button>
        <button onClick={toggleVisualizzaVoti} className="toggle-btn">Mostra/Nascondi Voti</button>
      </div>
      
      {showVisualizzaVoti && <VisualizzaVoti selectedClass={selectedClass} />}
    </div>
  );
}

InserimentoVoti.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sezione: PropTypes.string.isRequired
  }).isRequired
};

export default InserimentoVoti;
