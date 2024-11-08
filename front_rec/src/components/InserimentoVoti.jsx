import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import '../css/Registro.css'; // Assicurati che il percorso sia corretto per i tuoi CSS

function InserimentoVoti({ selectedClass }) {
  const [studentiClasse, setStudentiClasse] = useState([]);
  const [voti, setVoti] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass.id) return;

      setLoading(true);
      const token = localStorage.getItem('token'); // Assicurati che il token sia memorizzato correttamente
      try {
        const response = await fetch(`http://localhost:8000/api/classes/${selectedClass.id}/students/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Errore nel recupero degli studenti: ${response.status}`);
        }

        const data = await response.json();
        setStudentiClasse(data.students);
        // Initialize voti state
        const initialVoti = data.students.reduce((acc, studente) => ({
          ...acc,
          [studente.id]: { scritto: '', orale: '', appunti: '' }
        }), {});
        setVoti(initialVoti);
      } catch (err) {
        console.error("Errore durante il fetch degli studenti:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
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
    const token = localStorage.getItem('token');
    try {
      const votiData = Object.keys(voti).map(studenteId => ({
        studente: studenteId,
        scritto: voti[studenteId].scritto,
        orale: voti[studenteId].orale,
        appunti: voti[studenteId].appunti
      }));

      console.log("Payload inviato:", JSON.stringify(votiData)); // Visualizza il payload per debug

      const response = await fetch('http://localhost:8000/api/voto/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(votiData) // Assicurati che votiData sia un array
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Voti inviati con successo!');
    } catch (error) {
      console.error('Errore durante l\'invio dei voti:', error);
    }
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
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Inserisci voto"
                  value={voti[studente.id].scritto}
                  onChange={(e) => handleInputChange(studente.id, 'scritto', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Inserisci voto"
                  value={voti[studente.id].orale}
                  onChange={(e) => handleInputChange(studente.id, 'orale', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Aggiungi appunti"
                  value={voti[studente.id].appunti}
                  onChange={(e) => handleInputChange(studente.id, 'appunti', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Invia Tutti i Voti</button>
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
