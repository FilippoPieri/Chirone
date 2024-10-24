import PropTypes from 'prop-types';
import { useState } from 'react';
import { voti, materie } from './mockdb'; // Assicurati di importare voti e materie
import '../css/VotiStudente.css'; // Usa lo stesso CSS di VisualizzaVoti

function VotiStudente({ utenteLoggato }) {
  const [popup, setPopup] = useState(null); // Stato per gestire il popup
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 }); // Posizione del popup

  // Filtra i voti dello studente loggato
  const votiStudente = voti.filter(voto => voto.studenteId === utenteLoggato.id);

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
          {votiStudente.length > 0 ? (
            votiStudente.map((voto, index) => {
              const materia = materie.find(materia => materia.id === voto.materiaId)?.nomeMateria || 'N/A';
              return (
                <tr key={index}>
                  <td>{materia}</td>
                  <td>
                    {voto.scritto || 'N/A'}
                    {voto.scritto && (
                      <span onClick={(event) => openPopup(voto, event)} className="voto-link"> (i)</span>
                    )}
                  </td>
                  <td>
                    {voto.orale || 'N/A'}
                    {voto.orale && (
                      <span onClick={(event) => openPopup(voto, event)} className="voto-link"> (i)</span>
                    )}
                  </td>
                </tr>
              );
            })
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

VotiStudente.propTypes = {
  utenteLoggato: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    cognome: PropTypes.string.isRequired,
  }).isRequired,
};

export default VotiStudente;
