import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "./authUtils";
import "../css/VisualizzaRegistro.css";

function VisualizzaRegistro({ selectedClass }) {
  const [presenze, setPresenze] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPresenzePerClasse = async () => {
      setLoading(true);
      try {
        const response = await authFetch(`http://localhost:8000/api/presenze/oggi/classe/${selectedClass.id}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Errore nel recupero delle presenze per la classe con ID ${selectedClass.id}`);
        }

        const data = await response.json();
        setPresenze(data);
      } catch (err) {
        setError(err.message || "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    };

    if (selectedClass && selectedClass.id) {
      fetchPresenzePerClasse();
    }
  }, [selectedClass]);

  // Raggruppa le presenze per studente
  const presenzeRaggruppate = useMemo(() => {
    const raggruppate = {};
    presenze.forEach((presenza) => {
      const key = `${presenza.studente.nome} ${presenza.studente.cognome}`;
      if (!raggruppate[key]) {
        raggruppate[key] = {
          studente: presenza.studente,
          stati: [],
          entrateRitardo: [],
          usciteAnticipate: [],
          giustificazioni: [],
        };
      }
      raggruppate[key].stati.push(presenza.stato);
      if (presenza.entrata_ritardo) {
        raggruppate[key].entrateRitardo.push(presenza.entrata_ritardo);
      }
      if (presenza.uscita_anticipata) {
        raggruppate[key].usciteAnticipate.push(presenza.uscita_anticipata);
      }
      if (presenza.giustificazione) {
        raggruppate[key].giustificazioni.push(presenza.giustificazione);
      }
    });
    return Object.values(raggruppate);
  }, [presenze]);

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div className="registro-details">
      <h3>Presenze della classe {selectedClass.anno}{selectedClass.sezione}</h3>
      <table className="visualizza-registro-table">
        <thead>
          <tr>
            <th>Studente</th>
            <th>Stato</th>
            <th>Entrata in Ritardo</th>
            <th>Uscita Anticipata</th>
            <th>Giustificazione</th>
          </tr>
        </thead>
        <tbody>
          {presenzeRaggruppate.length > 0 ? presenzeRaggruppate.map((presenza, index) => (
            <tr key={index}>
              <td>{`${presenza.studente.nome} ${presenza.studente.cognome}`}</td>
              <td>{presenza.stati.map((stato, i) => (
                <span key={i} className={`stato-indicatore ${stato === "presente" ? "stato-presente" : "stato-assente"}`}></span>
              ))}</td>
              <td>{presenza.entrateRitardo.length > 0 ? presenza.entrateRitardo.join(", ") : "N/A"}</td>
              <td>{presenza.usciteAnticipate.length > 0 ? presenza.usciteAnticipate.join(", ") : "N/A"}</td>
              <td>{presenza.giustificazioni.length > 0 ? "Giustificato" : "Non giustificato"}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5">Nessuna presenza registrata per questa classe oggi.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

VisualizzaRegistro.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sezione: PropTypes.string.isRequired
  }).isRequired,
};

export default VisualizzaRegistro;
