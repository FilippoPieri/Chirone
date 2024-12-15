import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { authFetch } from "./authUtils";
import "../css/RegistroStudente.css";

function RegistroStudente({ utenteLoggato }) {
  const [assenze, setAssenze] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssenze = async () => {
      setLoading(true);
      try {
        const response = await authFetch("http://localhost:8000/api/presenze-studente/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Errore nel recupero delle assenze");
        }

        const data = await response.json();
        setAssenze(data);
      } catch (err) {
        setError(err.message || "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    };

    fetchAssenze();
  }, []);

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div className="registro-studente">
      <h3>Assenze di {utenteLoggato.nome} {utenteLoggato.cognome}</h3>
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
          {assenze.length > 0 ? assenze.map((assenza, index) => (
            <tr key={index}>
              <td>{assenza.data}</td>
              <td>Assente</td>
              <td>{assenza.entrata_ritardo || "Nessuna"}</td>
              <td>{assenza.uscita_anticipata || "Nessuna"}</td>
              <td>{assenza.giustificazione ? "Giustificato" : "Non giustificato"}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5">Nessuna assenza registrata</td>
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
