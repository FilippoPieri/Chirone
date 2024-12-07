import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import VisualizzaVoti from './VisualizzaVoti'; // Assicurati di importare il componente VisualizzaVoti
import { authFetch } from './authUtils'; // Modifica il percorso se necessario
import '../css/InserimentoVoti.css'; // Assicurati che il percorso sia corretto per i tuoi CSS

function InserimentoVoti({ selectedClass }) {
  const [studentiClasse, setStudentiClasse] = useState([]);
  const [voti, setVoti] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMateriaId, setSelectedMateriaId] = useState(null); // Aggiungi lo stato per la materia
  const [showVisualizzaVoti, setShowVisualizzaVoti] = useState(false); // Aggiunto stato per mostrare/nascondere VisualizzaVoti

  // Recupera l'utente loggato (simulazione con localStorage per esempio)
  const utenteLoggato = {
    id: localStorage.getItem('userId'), // Assicurati che `userId` sia presente nel localStorage
  };

  useEffect(() => {
    const fetchStudentsAndMateria = async () => {
      if (!selectedClass.id) return;

      setLoading(true);
      try {
        // Fetch degli studenti della classe
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

        // Inizializza lo stato dei voti per ogni studente
        const initialVoti = dataStudents.students.reduce((acc, studente) => ({
          ...acc,
          [studente.id]: { scritto: '', orale: '', appunti: '' }
        }), {});
        setVoti(initialVoti);

        // Fetch della materia associata all'insegnante loggato
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
    try {
      const votiData = Object.keys(voti).map(studenteId => ({
        studente: studenteId,
        scritto: voti[studenteId].scritto,
        orale: voti[studenteId].orale,
        appunti: voti[studenteId].appunti,
        materia: selectedMateriaId // Aggiungi qui l'ID della materia corretta
      }));

      console.log("Payload inviato:", JSON.stringify(votiData)); // Visualizza il payload per debug

      const response = await authFetch('http://localhost:8000/api/voto/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(votiData) // Assicurati che votiData sia un array
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Voti inviati con successo!');
      // Resetta lo stato dei voti
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
    setShowVisualizzaVoti(!showVisualizzaVoti); // Toggle della visualizzazione di VisualizzaVoti
  };

  console.log("selectedClass in InserimentoVoti:", selectedClass);
  console.log("utenteLoggato in InserimentoVoti:", utenteLoggato);

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
                  name={`scritto-${studente.id}`}
                  id={`scritto-${studente.id}`}
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
                  name={`orale-${studente.id}`}
                  id={`orale-${studente.id}`}
                  value={voti[studente.id].orale}
                  onChange={(e) => handleInputChange(studente.id, 'orale', e.target.value)}
                />
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
