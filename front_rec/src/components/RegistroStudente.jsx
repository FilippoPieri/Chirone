import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { authFetch } from './authUtils';
import '../css/RegistroStudente.css'; // Crea un file CSS per gli stili personalizzati

function RegistroStudente({ utenteLoggato }) {
  const [presenze, setPresenze] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPresenze = async () => {
      setLoading(true);

      try {
        const response = await  authFetch('http://localhost:8000/api/presenze-studente/', {
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

    fetchPresenze();
  }, []);

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>Errore: {error}</p>;


  return (
    <div className="registro-studente">
      <h3>Registro di {utenteLoggato.nome} {utenteLoggato.cognome}</h3>
      <table className="registro-table">
        <thead>
          <tr>
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
                <td>{presenza.data}</td>
                <td>{presenza.stato}</td>
                <td>{presenza.entrata_ritardo || 'Nessuna'}</td>
                <td>{presenza.uscita_anticipata || 'Nessuna'}</td>
                <td>
                  {presenza.giustificazione ? 'Giustificato' : 'Non giustificato'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nessuna presenza registrata</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

RegistroStudente.propTypes = {
  utenteLoggato: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    cognome: PropTypes.string.isRequired,
  }).isRequired,
};

export default RegistroStudente;