import PropTypes from "prop-types";
import  { useState, useEffect } from 'react';
import { authFetch } from './authUtils'; // Importa la funzione dal file utility
import '../css/ClassSelector.css';

function ClassSelector({ onClassSelect, insegnanteLoggato }) {
  const [classi, setClassi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(() => {
    if (!insegnanteLoggato.id) return;

      const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await authFetch(`http://localhost:8000/api/insegnante/classes/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch classes');
            }

            const data = await response.json();
            setClassi(data.classes || []); // Fallback a un array vuoto
            setError('');
        } catch (err) {
            console.error("Errore durante il fetch:", err);
            setError(`Errore nel recupero delle classi: ${err.message}`);
            setClassi([]);
        } finally {
            setLoading(false);
        }
    };

    fetchClasses();
  }, [insegnanteLoggato.id]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>{error}</p>;
  console.log(classi.map(classe => classe.id));

  return (
    <div className="class-list">
      {classi.length > 0 ? (
        classi.map(classe => classe.id ? ( // Verifica che classe.id esista prima di renderizzare il componente
          <div key={classe.id} className="class-block" onClick={() => onClassSelect(classe)}>
            <h4>{classe.anno} {classe.sezione}</h4>
            <p>Classe della scuola {classe.scuola_nome}</p>
          </div>
        ) : null)
      ) : (
        <p>Nessuna classe disponibile per questo insegnante.</p>
      )}
    </div>
  );  
}

ClassSelector.propTypes = {
  onClassSelect: PropTypes.func.isRequired,
  insegnanteLoggato: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired
};

export default ClassSelector;    

