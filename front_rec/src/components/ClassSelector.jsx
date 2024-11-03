import PropTypes from "prop-types";
import  { useState, useEffect } from 'react';
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
        const token = localStorage.getItem('token');
        console.log('Token storage:', token);
        const response = await fetch(`/api/insegnante/classes/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        //deb
        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers.get('Content-Type'));
        //fin

        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }

        const data = await response.json();
        //deb
        console.log("Classi ricevute dal backend:", data.classes);  // Debug: visualizza le classi
        //fin
        setClassi(data.classes);
        setError('');
      } catch (err) {
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

  return (
    <div className="class-list">
      {classi.length > 0 ? (
        classi.map(classe => (
          <div key={classe.id} className="class-block" onClick={() => onClassSelect(classe)}>
            <h4>{classe.anno} {classe.sezione}</h4>
            <p>Classe della scuola {classe.scuolaId}</p>
          </div>
        ))
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