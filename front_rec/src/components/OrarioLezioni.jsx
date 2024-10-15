import PropTypes from 'prop-types';
import { useState } from 'react';
import { materie, insegnanti } from './mockdb'; 
import '../css/OrarioLezioni.css'; // Importa il file CSS
import VisualizzaOrario from './VisualizzaOrario'; // Importa il nuovo componente

const giorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const oreGiornaliere = [8, 9, 10, 11, 12, 13, 14 , 15, 16, 17, 18];

function OrarioLezioni({ selectedClass }) {
    console.log("OrarioLezioni renderizzato per la classe:", selectedClass); // Debug

    // Inizializza lo stato per memorizzare l'orario settimanale per ogni giorno e ora
    const [orario, setOrario] = useState(
      giorniSettimana.reduce((acc, giorno) => {
        acc[giorno] = oreGiornaliere.reduce((oreAcc, ora) => {
          oreAcc[ora] = '';
          return oreAcc;
        }, {});
        return acc;
      }, {})
    );
  
    const [mostraOrarioSettimanale, setMostraOrarioSettimanale] = useState(false); // Stato per visualizzare l'orario settimanale
    const [inserisciOrarioVisible, setInserisciOrarioVisible] = useState(true); // Stato per mostrare/nascondere il form di inserimento orario

    // Gestisce il cambiamento di una materia per un giorno e una certa ora
    const handleOrarioChange = (giorno, ora, materia) => {
      setOrario(prevOrario => ({
        ...prevOrario,
        [giorno]: {
          ...prevOrario[giorno],
          [ora]: materia
        }
      }));
    };

    const handleSalvaOrario = () => {
      console.log("Orario salvato per la classe:", selectedClass, "Orario:", orario);
    };

    const handleMostraOrarioSettimanale = () => {
      setMostraOrarioSettimanale(true);
      setInserisciOrarioVisible(false); // Nascondi il form di inserimento orario
    };

    const handleInserisciOrario = () => {
      setMostraOrarioSettimanale(false);
      setInserisciOrarioVisible(true); // Mostra il form di inserimento orario
    };

    return (
      <div className="orario-details">
        <h3>Inserisci l&#39;orario per la classe {selectedClass.anno}{selectedClass.sezione}</h3>

        {/* Pulsante per mostrare l'orario settimanale */}
        {!mostraOrarioSettimanale && (
          <button onClick={handleMostraOrarioSettimanale}>
            Mostra Orario Settimanale
          </button>
        )}
        
        {/* Pulsante per tornare alla visualizzazione dell'inserimento orario */}
        {mostraOrarioSettimanale && (
          <button onClick={handleInserisciOrario}>
            Inserisci Orario
          </button>
        )}

        {/* Visualizzazione dell'orario settimanale tramite il nuovo componente */}
        {mostraOrarioSettimanale && <VisualizzaOrario selectedClass={selectedClass} orario={orario} />}
    
        {inserisciOrarioVisible && (
          <table className="orario-table">
            <thead>
              <tr>
                <th>Ora</th>
                {giorniSettimana.map(giorno => (
                  <th key={giorno}>{giorno}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {oreGiornaliere.map(ora => (
                <tr key={ora}>
                  <td>{ora}:00 - {ora + 1}:00</td>
                  {giorniSettimana.map(giorno => (
                    <td key={giorno}>
                      <select
                        value={orario[giorno][ora]}
                        onChange={(e) => handleOrarioChange(giorno, ora, e.target.value)}
                      >
                        <option value="">Seleziona materia</option>
                        {/* Filtriamo le materie associate alla classe selezionata */}
                        {materie.filter(materia => 
                          materia.classiIds.includes(selectedClass.id) // Assicuriamoci che la materia sia per la classe selezionata
                        ).map(materia => {
                          const insegnante = insegnanti.find(insegnante => insegnante.id === materia.insegnanteId);
                          return (
                            <option key={materia.id} value={materia.nomeMateria}>
                              {materia.nomeMateria} - {insegnante ? `${insegnante.nome} ${insegnante.cognome}` : 'N/A'}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {inserisciOrarioVisible && (
          <button onClick={handleSalvaOrario}>Salva Orario</button>
        )}
      </div>
    );
}

// Definizione delle PropTypes
OrarioLezioni.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anno: PropTypes.string.isRequired,
    sezione: PropTypes.string.isRequired
  }).isRequired
};

export default OrarioLezioni;
