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
              if (voto.scritto) {
                votiPerMateria[voto.materiaId].votiScritti.push(voto);
              }
              if (voto.orale) {
                votiPerMateria[voto.materiaId].votiOrali.push(voto);
              }
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
                    {votiScritti.length > 0 && votiScritti.map((voto, index) => (
                      <span key={index}>
                        {voto.scritto}
                        {/* Visualizza il link (info) solo se esiste un voto */}
                        {voto.scritto && (
                          <span onClick={(event) => openPopup(voto, event)} className="voto-link"> (info)</span>
                        )}
                        {index < votiScritti.length - 1 && ', '}
                      </span>
                    ))}
                  </td>
                  <td>
                    {votiOrali.length > 0 && votiOrali.map((voto, index) => (
                      <span key={index}>
                        {voto.orale}
                        {/* Visualizza il link (info) solo se esiste un voto */}
                        {voto.orale && (
                          <span onClick={(event) => openPopup(voto, event)} className="voto-link"> (info)</span>
                        )}
                        {index < votiOrali.length - 1 && ', '}
                      </span>
                    ))}
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
            <p><strong>Data:</strong> {popup.data}</p>
            {/* Mostra il voto scritto o orale, a seconda di quale è presente */}
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
  studentiClasse: PropTypes.array.isRequired, // Lista degli studenti della classe selezionata
};

export default VisualizzaVoti;

