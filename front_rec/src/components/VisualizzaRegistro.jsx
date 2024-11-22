import PropTypes from "prop-types";
import { useEffect, useState } from 'react';
import { authFetch } from "./authUtils";
import '../css/VisualizzaRegistro.css';

function VisualizzaRegistro() {
  const [presenze, setPresenze] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch per ottenere le presenze del giorno corrente
  useEffect(() => {
    const fetchPresenzeOggi = async () => {
      setLoading(true);

      try {
        const response = await  authFetch('http://localhost:8000/api/presenze/oggi/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Errore nel recupero delle presenze');
        }
        
        const data = await response.json();
        setPresenze(data);
      } catch (err) {
        setError(err.message || 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchPresenzeOggi();
  }, []);

  // Condizioni di caricamento e gestione degli errori
  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>Errore: {error}</p>;

  // Ritorna la tabella delle presenze
  return (
    <div className="visualizza-registro">
      <h3>Presenze di Oggi</h3>
      <table className="visualizza-registro-table">
        <thead>
          <tr>
            <th>Studente</th>
            <th>Data</th>
            <th>Presenza</th>
            <th>Entrata in Ritardo</th>
            <th>Uscita Anticipata</th>
            <th>Giustificazione</th>
          </tr>
        </thead>
        <tbody>
        {presenze.length > 0 ? (
            presenze.map((presenza, index) => (
              <tr key={index}>
                <td>{presenza.studente ? `${presenza.studente.nome} ${presenza.studente.cognome}` : 'Studente non trovato'}</td>
                <td>{presenza.data}</td>
                <td className={presenza.stato === 'presente' ? 'presente' : 'assente'}>
                  {presenza.stato === 'presente' ? 'Presente' : 'Assente'}
                </td>
                <td>{presenza.entrata_ritardo || 'N/A'}</td>
                <td>{presenza.uscita_anticipata || 'N/A'}</td>
                <td className={presenza.giustificazione ? 'giustificato' : 'non-giustificato'}>
                  {presenza.giustificazione ? 'Giustificato' : 'Non giustificato'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Nessuna presenza registrata per oggi.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

VisualizzaRegistro.propTypes = {
  presenze: PropTypes.arrayOf(
    PropTypes.shape({
      studente: PropTypes.shape({
        nome: PropTypes.string.isRequired,
        cognome: PropTypes.string.isRequired
      }),
      data: PropTypes.string.isRequired,
      stato: PropTypes.string.isRequired,
      entrata_ritardo: PropTypes.string,
      uscita_anticipata: PropTypes.string,
      giustificazione: PropTypes.bool.isRequired,
    })
  ),
};

export default VisualizzaRegistro;