import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { authFetch } from './authUtils'; // Modifica il percorso se necessario
import '../css/VisualizzaVoti.css';

function VisualizzaVoti({ selectedClass }) {
  const [students, setStudents] = useState([]);
  const [voti, setVoti] = useState([]);
  const [materie, setMaterie] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  console.log('danni agio');
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, votiRes, materieRes] = await Promise.all([
          authFetch(`http://localhost:8000/api/classes/${selectedClass.id}/students/`, {
            headers: { 
              'Content-Type': 'application/json',
            },
          }),
          authFetch(`http://localhost:8000/api/insegnante/classe/${selectedClass.id}/voti/`, {
            headers: { 
              'Content-Type': 'application/json',
            },
          }),
          authFetch(`http://localhost:8000/api/insegnante/materie/`, {
            headers: { 
              'Content-Type': 'application/json', 
            },
          }),
        ]);

        const studentsData = await studentsRes.json();
        const votiData = await votiRes.json();
        const materieData = await materieRes.json();

        setStudents(studentsData.students);
        setVoti(votiData);
        setMaterie(materieData.materie);
      } catch {
        setError('Errore durante il caricamento dei dati.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedClass]);

  const getMateriaNome = (materiaId) => {
    const materia = materie.find((m) => m.id === materiaId);
    return materia ? materia.nome : 'Materia non trovata';
  };

  const openPopup = (voto, event) => {
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({ top: rect.top + window.scrollY - 50, left: rect.left + window.scrollX });
    setPopup(voto);
  };

  const closePopup = () => setPopup(null);

  if (loading) return <p>Caricamento dati...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div className="voti-salvati">
      <h4>Voti degli studenti della classe {selectedClass.anno} {selectedClass.sezione}</h4>
      <table className="uniform-table">
        <thead>
          <tr>
            <th>Nome Studente</th>
            <th>Materia</th>
            <th>Voti Scritti</th>
            <th>Voti Orali</th>
          </tr>
        </thead>
        <tbody>
          {students.map((studente) => {
            const votiStudente = voti.filter((voto) => voto.studente === studente.id);
            const votiPerMateria = {};

            // Raggruppa i voti per materia
            votiStudente.forEach((voto, index) => {
              const materiaNome = getMateriaNome(voto.materia);
              if (!votiPerMateria[materiaNome]) {
                votiPerMateria[materiaNome] = { scritti: [], orali: [] };
              }
              const keyBase = `-${index}-${Date.now()}`; // Aggiungi un indice e un timestamp per unicità
              if (voto.scritto) votiPerMateria[materiaNome].scritti.push(
                <span key={`scritto-${voto.id || keyBase}`} onClick={(event) => openPopup(voto, event)} className="voto-link">
                  {voto.scritto}
                </span>
              );
              if (voto.orale) votiPerMateria[materiaNome].orali.push(
                <span key={`orale-${voto.id || keyBase}`} onClick={(event) => openPopup(voto, event)} className="voto-link">
                  {voto.orale}
                </span>
              );
            });

            // Crea una riga per ogni materia con voti scritti e orali, separati da virgole
            return Object.keys(votiPerMateria).map((materiaNome, index) => (
              <tr key={`${studente.id}-${materiaNome}-${index}`}>
                <td>{`${studente.nome} ${studente.cognome}`}</td>
                <td>{materiaNome}</td>
                <td>{votiPerMateria[materiaNome].scritti.length > 0 ? votiPerMateria[materiaNome].scritti.reduce((prev, curr) => [prev, ', ', curr]) : 'N/A'}</td>
                <td>{votiPerMateria[materiaNome].orali.length > 0 ? votiPerMateria[materiaNome].orali.reduce((prev, curr) => [prev, ', ', curr]) : 'N/A'}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>

      {/* Popup per visualizzare i dettagli del voto */}
      {popup && (
        <div className="popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
          <div className="popup-content">
            <h4>Dettagli Voto</h4>
            <p><strong>Data:</strong> {popup.data}</p>
            {popup.scritto && <p><strong>Voto Scritto:</strong> {popup.scritto}</p>}
            {popup.orale && <p><strong>Voto Orale:</strong> {popup.orale}</p>}
            <p><strong>Appunti:</strong> {popup.appunti || 'Nessun appunto'}</p>
            <button onClick={closePopup}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
}

VisualizzaVoti.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sezione: PropTypes.string.isRequired,
  }).isRequired,
};

export default VisualizzaVoti;