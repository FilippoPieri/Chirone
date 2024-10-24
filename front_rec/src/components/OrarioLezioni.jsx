import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';  // Per fare le richieste API
import '../css/OrarioLezioni.css'; // Importa il file CSS
import VisualizzaOrario from './VisualizzaOrario'; // Importa il nuovo componente

const giorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const oreGiornaliere = [8, 9, 10, 11, 12, 13, 14 , 15, 16, 17, 18];

function OrarioLezioni({ selectedClass, utenteLoggato }) {
    const [orario, setOrario] = useState([]); // Stato per memorizzare l'orario

    useEffect(() => {
        // Chiama l'API per ottenere i dati dell'orario della classe selezionata
        axios.get('http://localhost:8000/api/orario/')
            .then(response => {
                // Filtra i dati dell'orario per la classe selezionata
                const orariFiltrati = response.data.filter(orario => orario.classe === selectedClass.id);
                setOrario(orariFiltrati); // Imposta lo stato dell'orario
            })
            .catch(error => {
                console.error('Errore nel caricamento dell\'orario:', error);
            });
    }, [selectedClass]); // Effettua la chiamata API quando cambia la classe selezionata
  
    const [mostraOrarioSettimanale, setMostraOrarioSettimanale] = useState(false); // Stato per visualizzare l'orario settimanale
    const [inserisciOrarioVisible, setInserisciOrarioVisible] = useState(true); // Stato per mostrare/nascondere il form di inserimento orario

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

        {/* Visualizzazione dell'orario settimanale tramite il componente Visualizzaorario */}
        {mostraOrarioSettimanale && <VisualizzaOrario selectedClass={selectedClass} orario={orario} />}
    
        {/* Condizione per mostrare il form di inserimento orario */}
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
                      {/* Seleziona la materia per l'insegnante loggato */}
                      <select
                        id={`orario-${giorno}-${ora}`} // Aggiungi id univoco
                        name={`orario-${giorno}-${ora}`} // Aggiungi name univoco
                        value={orario[giorno][ora]}
                        onChange={(e) => handleOrarioChange(giorno, ora, e.target.value)}
                      >
                         <option value="">Seleziona materia</option>
                          {/* Mostra solo le materie dell'insegnante loggato */}
                          {materieInsegnante.map(materia => (
                            <option key={materia.id} value={materia.nomeMateria}>
                              {materia.nomeMateria}
                            </option>
                          ))}
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
    anno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Accetta sia stringa che numero
    sezione: PropTypes.string.isRequired
  }).isRequired,
    utenteLoggato: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired
};


export default OrarioLezioni;
