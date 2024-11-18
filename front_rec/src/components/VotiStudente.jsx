import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import '../css/VotiStudente.css'; // Usa lo stesso CSS di VisualizzaVoti

function VotiStudente({ utenteLoggato }) {
  const [votiPerMateria, setVotiPerMateria] = useState({});
  const [materie, setMaterie] = useState({});
  const [popup, setPopup] = useState(null); // Stato per gestire il popup
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 }); // Posizione del popup
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoti = async () => {
      setLoading(true);
      const token = localStorage.getItem('token'); // Recupera il token dal localStorage

      try {
        // Fetch dei voti dello studente loggato
        const responseVoti = await fetch('http://localhost:8000/api/voti-studente/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!responseVoti.ok) {
          throw new Error('Errore nel recupero dei voti');
        }

        const votiData = await responseVoti.json();

        // Fetch delle materie
        const responseMaterie = await fetch('http://localhost:8000/api/materie/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!responseMaterie.ok) {
          throw new Error('Errore nel recupero delle materie');
        }

        const materieData = await responseMaterie.json();
        const materieMap = materieData.reduce((acc, materia) => {
          acc[materia.id] = materia.nome;
          return acc;
        }, {});

        setMaterie(materieMap);

        // Raggruppa i voti per materia
        const raggruppati = votiData.reduce((acc, voto) => {
          const materiaId = voto.materia;
          if (!acc[materiaId]) {
            acc[materiaId] = { scritto: [], orale: [], materiaId };
          }
          if (voto.scritto) acc[materiaId].scritto.push({ value: voto.scritto, data: voto.data, appunti: voto.appunti });
          if (voto.orale) acc[materiaId].orale.push({ value: voto.orale, data: voto.data, appunti: voto.appunti });
          return acc;
        }, {});

        setVotiPerMateria(raggruppati);
      } catch (err) {
        setError(err.message || 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchVoti();
  }, []);

  // Funzione per aprire il popup
  const openPopup = (voto, event) => {
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({ top: rect.top + window.scrollY - 50, left: rect.left + window.scrollX });
    setPopup(voto);
  };

  // Funzione per chiudere il popup
  const closePopup = () => {
    setPopup(null);
  };

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div className="voti-salvati">
      <h4>Voti di {utenteLoggato.nome} {utenteLoggato.cognome}</h4>
      <table className="registro-table">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Voti Scritti</th>
            <th>Voti Orali</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(votiPerMateria).length > 0 ? (
            Object.entries(votiPerMateria).map(([materiaId, voti]) => (
              <tr key={materiaId}>
                <td>{materie[materiaId] || 'N/A'}</td>
                <td>
                  {voti.scritto.map((voto, index) => (
                    <span
                      key={index}
                      className="voto-link"
                      onClick={(event) => openPopup(voto, event)}
                      title={`Data: ${voto.data}`}
                    >
                      {voto.value}
                    </span>
                  )).reduce((prev, curr) => [prev, ', ', curr])}
                </td>
                <td>
                  {voti.orale.map((voto, index) => (
                    <span
                      key={index}
                      className="voto-link"
                      onClick={(event) => openPopup(voto, event)}
                      title={`Data: ${voto.data}`}
                    >
                      {voto.value}
                    </span>
                  )).reduce((prev, curr) => [prev, ', ', curr])}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Nessun voto disponibile</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Popup per visualizzare i dettagli del voto */}
      {popup && (
        <div className="popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
          <div className="popup-content">
            <h4>Dettagli Voto</h4>
            <p><strong>Valore:</strong> {popup.value}</p>
            <p><strong>Data:</strong> {popup.data}</p>
            <p><strong>Appunti:</strong> {popup.appunti || 'Nessun appunto'}</p>
            <button onClick={closePopup}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
}

VotiStudente.propTypes = {
  utenteLoggato: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    cognome: PropTypes.string.isRequired,
  }).isRequired,
};

export default VotiStudente;