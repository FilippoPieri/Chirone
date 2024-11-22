import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { authFetch } from './authUtils'; // Modifica il percorso se necessario
import '../css/OrarioLezioni.css';

const giorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

function VisualizzaOrario({ selectedClass }) {
    const [orariClasse, setOrariClasse] = useState([]);
    const [materie, setMaterie] = useState({}); // Mappa degli ID materie a nomi delle materie

    useEffect(() => {
       
        async function fetchMaterie() {
            try {
                const response = await authFetch('http://localhost:8000/api/materie/', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("Risposta completa delle materie:", data);
        
                    // Creazione della mappa degli ID delle materie ai nomi senza usare `data.materie`
                    const materieMap = {};
                    data.forEach((materia) => {
                        materieMap[materia.id] = materia.nome;
                    });
                    setMaterie(materieMap);
                    console.log("Mappa delle materie dopo il fetch:", materieMap);
                } else {
                    throw new Error('Errore nel fetch delle materie');
                }
            } catch (error) {
                console.error('Errore durante il fetch delle materie:', error);
            }
        }

        async function fetchOrarioClasse() {
            try {
                const response = await authFetch(`http://localhost:8000/api/orario/${selectedClass.id}/`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrariClasse(data);
                    console.log("Dati orario ricevuti:", data);
                } else {
                    throw new Error('Errore nel fetch dell\'orario');
                }
            } catch (error) {
                console.error('Errore durante il fetch dell\'orario:', error);
            }
        }

        fetchMaterie();
        fetchOrarioClasse();
    }, [selectedClass.id]);

    // Costruisci la matrice dell'orario settimanale
    const orarioMatrice = giorniSettimana.reduce((acc, giorno) => {
        acc[giorno] = Array(10).fill(""); // 10 ore giornaliere (es. 8:00 - 18:00)
        return acc;
    }, {});

    orariClasse.forEach((orario) => {
        const { giornoSettimana, ora_inizio, materia } = orario;
        const oraIndex = parseInt(ora_inizio.split(":")[0]) - 8; // Calcola l'indice dell'ora

        // Usa la mappa delle materie per visualizzare il nome invece dell'ID
        orarioMatrice[giornoSettimana][oraIndex] = materie[materia] || ""; // Lascia vuoto se non trovato
    });

    console.log("Matrice orario popolata:", orarioMatrice);

    return (
        <div className="orario-settimanale">
            <h4>Orario Settimanale per la classe {selectedClass.anno}{selectedClass.sezione}</h4>
            <table className="orario-table">
                <thead>
                    <tr>
                        <th>Ora</th>
                        {giorniSettimana.map((giorno) => (
                            <th key={giorno}>{giorno}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <tr key={index}>
                            <td>{8 + index}:00 - {9 + index}:00</td>
                            {giorniSettimana.map((giorno) => (
                                <td key={giorno}>{orarioMatrice[giorno][index]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

VisualizzaOrario.propTypes = {
    selectedClass: PropTypes.shape({
        id: PropTypes.number.isRequired,
        anno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        sezione: PropTypes.string.isRequired
    }).isRequired
};

export default VisualizzaOrario;
