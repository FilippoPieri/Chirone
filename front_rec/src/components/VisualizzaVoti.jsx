import PropTypes from 'prop-types';
import { useState } from 'react';
import { voti as votiMockDb, materie } from './mockdb'; // Importiamo i voti e le materie
import '../css/VisualizzaVoti.css'; // Importa il file CSS

function VisualizzaVoti({ studentiClasse }) {
  const [voti] = useState(votiMockDb); // Stato per i voti
  const [popup, setPopup] = useState(null); // Stato per gestire il popup
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 }); // Posizione del popup

  // Funzione per aprire il popup
  const openPopup = (voto, event) => {
    const rect = event.target.getBoundingClientRect(); // Ottieni la posizione del voto
    setPopupPosition({ top: rect.top + window.scrollY - 50, left: rect.left + window.scrollX }); // Imposta la posizione del popup
    setPopup(voto);
  };

  // Funzione per chiudere il popup
  const closePopup = () => {
    setPopup(null);
  };

  return (
    <div className="voti-salvati">
      <h4>Voti per ogni studente</h4>
      <table className="registro-table">
        <thead>
          <tr>
            <th>Nome Studente</th>
            <th>Materia</th>
            <th>Voti Scritti</th>
            <th>Voti Orali</th>
          </tr>
        </thead>
        <tbody>
          {studentiClasse.map(studente => {
            // Filtra i voti per lo studente corrente
            const votiStudente = voti.filter(voto => voto.studenteId === studente.id);

            // Crea un oggetto per raggruppare i voti per materia
            const votiPerMateria = {};

            votiStudente.forEach(voto => {
              if (!votiPerMateria[voto.materiaId]) {
                votiPerMateria[voto.materiaId] = { materiaId: voto.materiaId, votiScritti: [], votiOrali: [] };
              }
              votiPerMateria[voto.materiaId].votiScritti.push(voto.scritto);
              votiPerMateria[voto.materiaId].votiOrali.push(voto.orale);
            });

            // Mappa per ogni materia e mostra i voti
            return Object.keys(votiPerMateria).map(materiaId => {
              const materia = materie.find(m => m.id === parseInt(materiaId));
              const { votiScritti, votiOrali } = votiPerMateria[materiaId];

              return (
                <tr key={`${studente.id}-${materiaId}`}>
                  <td>{studente.nome} {studente.cognome}</td>
                  <td>{materia.nomeMateria}</td>
                  <td>
                    {votiScritti.join(', ')} {/* Unisci i voti scritti con una virgola */}
                    <span onClick={(event) => openPopup({ materiaId, votiScritti, votiOrali }, event)} className="voto-link"> (info)</span>
                  </td>
                  <td>
                    {votiOrali.join(', ')} {/* Unisci i voti orali con una virgola */}
                    <span onClick={(event) => openPopup({ materiaId, votiScritti, votiOrali }, event)} className="voto-link"> (info)</span>
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>

      {/* Popup per visualizzare i dettagli del voto */}
      {popup && (
        <div className="popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
          <div className="popup-content">
            <h4>Dettagli Voto</h4>
            <p><strong>Materia ID:</strong> {popup.materiaId}</p>
            <p><strong>Voti Scritti:</strong> {popup.votiScritti.join(', ')}</p>
            <p><strong>Voti Orali:</strong> {popup.votiOrali.join(', ')}</p>
            <button onClick={closePopup}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
}

VisualizzaVoti.propTypes = {
  studentiClasse: PropTypes.array.isRequired, // Lista degli studenti della classe selezionata
};

export default VisualizzaVoti;
