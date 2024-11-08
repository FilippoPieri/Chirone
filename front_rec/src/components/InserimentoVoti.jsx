import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import '../css/Registro.css'; // Assicurati che il percorso sia corretto per i tuoi CSS

function InserimentoVoti({ selectedClass }) {
  const [studentiClasse, setStudentiClasse] = useState([]);
  const [voti, setVoti] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMateriaId, setSelectedMateriaId] = useState(null); // Aggiungi lo stato per la materia

  useEffect(() => {
    const fetchStudentsAndMateria = async () => {
      if (!selectedClass.id) return;

      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        // Fetch degli studenti della classe
        const responseStudents = await fetch(`http://localhost:8000/api/classes/${selectedClass.id}/students/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!responseStudents.ok) {
          throw new Error(`Errore nel recupero degli studenti: ${responseStudents.status}`);
        }

        const dataStudents = await responseStudents.json();
        setStudentiClasse(dataStudents.students);

        // Inizializza lo stato dei voti per ogni studente
        const initialVoti = dataStudents.students.reduce((acc, studente) => ({
          ...acc,
          [studente.id]: { scritto: '', orale: '', appunti: '' }
        }), {});
        setVoti(initialVoti);

        // Fetch della materia associata all'insegnante loggato
        const responseMateria = await fetch('http://localhost:8000/api/insegnante/materie/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!responseMateria.ok) {
          throw new Error(`Errore nel recupero della materia: ${responseMateria.status}`);
        }

        const dataMateria = await responseMateria.json();
        if (dataMateria.materie && dataMateria.materie.length > 0) {
          setSelectedMateriaId(dataMateria.materie[0].id); // Prendi l'ID della prima materia
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
    const token = localStorage.getItem('token');
    try {
      const votiData = Object.keys(voti).map(studenteId => ({
        studente: studenteId,
        scritto: voti[studenteId].scritto,
        orale: voti[studenteId].orale,
        appunti: voti[studenteId].appunti,
        materia: selectedMateriaId // Aggiungi qui l'ID della materia corretta
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
