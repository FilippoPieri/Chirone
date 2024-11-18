import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../css/OrarioStudente.css';

const giorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

function VisualizzaOrarioStudente({ utenteLoggato }) {
    const [orario, setOrario] = useState([]);
    const [materie, setMaterie] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');

        async function fetchMaterie() {
            try {
                const response = await fetch('http://localhost:8000/api/materie/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const materieMap = {};
                    data.forEach((materia) => {
                        materieMap[materia.id] = materia.nome;
                    });
                    setMaterie(materieMap);
                } else {
                    throw new Error('Errore nel recupero delle materie');
                }
            } catch (error) {
                console.error('Errore durante il recupero delle materie:', error);
            }
        }

        async function fetchOrarioStudente() {
            try {
                const response = await fetch(`http://localhost:8000/api/orario-studente/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrario(data);
                } else {
                    throw new Error('Errore nel recupero dell\'orario dello studente');
                }
            } catch (error) {
                console.error('Errore durante il recupero dell\'orario dello studente:', error);
            }
        }

        fetchMaterie();
        fetchOrarioStudente();
    }, [utenteLoggato.id]);

    // Costruisci la matrice dell'orario settimanale
    const orarioMatrice = giorniSettimana.reduce((acc, giorno) => {
        acc[giorno] = Array(10).fill("");
        return acc;
    }, {});

    orario.forEach((orario) => {
        const { giornoSettimana, ora_inizio, materia } = orario;
        const oraIndex = parseInt(ora_inizio.split(":")[0]) - 8; // Calcola l'indice dell'ora
        orarioMatrice[giornoSettimana][oraIndex] = materie[materia] || ""; // Usa il nome della materia
    });

    return (
        <div className="orario-studente">
            <h4>Orario Settimanale di {utenteLoggato.nome} {utenteLoggato.cognome}</h4>
            <table className="uniform-table">
                <thead>
                    <tr>
                        <th>Ora</th>
                        {giorniSettimana.map(giorno => <th key={giorno}>{giorno}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <tr key={index}>
                            <td>{8 + index}:00 - {9 + index}:00</td>
                            {giorniSettimana.map(giorno => (
                                <td key={giorno}>{orarioMatrice[giorno][index]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

VisualizzaOrarioStudente.propTypes = {
    utenteLoggato: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nome: PropTypes.string.isRequired,
        cognome: PropTypes.string.isRequired,
    }).isRequired
};

export default VisualizzaOrarioStudente;
