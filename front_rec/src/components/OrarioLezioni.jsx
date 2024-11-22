import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import '../css/OrarioLezioni.css'; // Importa il file CSS
import VisualizzaOrario from './VisualizzaOrario'; // Importa il nuovo componente
import { authFetch } from './authUtils'; // Modifica il percorso se necessario

const giorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const oreGiornaliere = [8, 9, 10, 11, 12, 13, 14 , 15, 16, 17, 18];

function OrarioLezioni({ selectedClass, utenteLoggato }) {
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
  
    const [materie, setMaterie] = useState([]);
    const [mostraOrarioSettimanale, setMostraOrarioSettimanale] = useState(false);
    const [inserisciOrarioVisible, setInserisciOrarioVisible] = useState(true);

     // Fetch materie dall'API quando il componente viene montato
     useEffect(() => {
      async function fetchMaterie() {

          try {
              const response = await authFetch(`http://localhost:8000/api/insegnante/materie/`, {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });
              if (response.ok) {
                  const data = await response.json();
                  setMaterie(data.materie);
              } else {
                  throw new Error('Failed to fetch materie');
              }
          } catch (error) {
              console.error('Error fetching materie:', error);
          }
      }

      fetchMaterie();
  }, [utenteLoggato.id]);

  const handleOrarioChange = (giorno, ora, materia) => {
      setOrario(prevOrario => ({
          ...prevOrario,
          [giorno]: {
              ...prevOrario[giorno],
              [ora]: materia
          }
      }));
  };

  const handleSalvaOrario = async () => {
    console.log("Salvataggio dell'orario:", orario);
    const orarioDaInviare = Object.keys(orario).flatMap(giorno => {
      return Object.keys(orario[giorno]).map(ora => {
          const materia = orario[giorno][ora];
            return materia ? {
                classe: selectedClass.id,
                materia: parseInt(materia),  // Include l'ID della materia
                giornoSettimana: giorno,
                ora_inizio: `${ora}:00`,
                ora_fine: `${parseInt(ora) + 1}:00`
            } : null;
        }).filter(item => item !== null);
    });

    console.log("Orario da inviare:", orarioDaInviare);

    try {
        const response = await authFetch('http://localhost:8000/api/orario/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orarioDaInviare)  // Invia l'intero array
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Orario salvato con successo:', data);
        } else {
            const errorData = await response.json();
            console.error('Errore nel salvataggio dell\'orario:', errorData);
        }
    } catch (error) {
        console.error('Errore di rete nel salvataggio dell\'orario:', error);
    }
};

  const handleMostraOrarioSettimanale = () => {
      setMostraOrarioSettimanale(true);
      setInserisciOrarioVisible(false);
  };

  const handleInserisciOrario = () => {
      setMostraOrarioSettimanale(false);
      setInserisciOrarioVisible(true);
  };


    return (
      <div className="orario-details">
        <h3>Inserisci l&#39;orario per la classe {selectedClass.anno}{selectedClass.sezione}</h3>

        {/* Pulsante per mostrare l'orario settimanale */}
        {!mostraOrarioSettimanale && (
          <button onClick={handleMostraOrarioSettimanale}>Mostra Orario Settimanale</button>
        )}
        
        {/* Pulsante per tornare alla visualizzazione dell'inserimento orario */}
        {mostraOrarioSettimanale && (
          <button onClick={handleInserisciOrario}>Inserisci Orario</button>
        )}

        {/* Visualizzazione dell'orario settimanale tramite il componente Visualizzaorario */}
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
                                            id={`orario-${giorno}-${ora}`}
                                            name={`orario-${giorno}-${ora}`}
                                            value={orario[giorno][ora]}
                                            onChange={(e) => handleOrarioChange(giorno, ora, e.target.value)}
                                        >
                                            <option value="">Seleziona materia</option>
                                            {materie.map(materia => (
                                                <option key={materia.id} value={materia.id}>
                                                    {materia.nome}
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

OrarioLezioni.propTypes = {
    selectedClass: PropTypes.shape({
        id: PropTypes.number.isRequired,
        anno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        sezione: PropTypes.string.isRequired
    }).isRequired,
    utenteLoggato: PropTypes.shape({
        id: PropTypes.number.isRequired
    }).isRequired
};

export default OrarioLezioni;