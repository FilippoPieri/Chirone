import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "./authUtils";
import "../css/Tabelle.css";

function VisualizzaRegistro() {
  const [presenze, setPresenze] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch per ottenere le presenze del giorno corrente
  useEffect(() => {
    const fetchPresenzeOggi = async () => {
      setLoading(true);
      try {
        const response = await authFetch("http://localhost:8000/api/presenze/oggi/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Errore nel recupero delle presenze");
        }

        const data = await response.json();
        setPresenze(data);
      } catch (err) {
        setError(err.message || "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    };

    fetchPresenzeOggi();
  }, []);

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
      // Aggiunge i dati aggregati
      raggruppate[key].stati.push(presenza.stato); // Stato (presente/assente)
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
    return Object.values(raggruppate); // Trasforma l'oggetto in array per la renderizzazione
  }, [presenze]);

  // Gestione caricamento ed errori
  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div className="visualizza-registro">
      <h3>Appello di Oggi</h3>
      <div className="table-container">
        <table className="tabelle-uniformi visualizza-registro-table">
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
            {presenzeRaggruppate.length > 0 ? (
              presenzeRaggruppate.map((presenza, index) => (
                <tr key={index}>
                  <td>{`${presenza.studente.nome} ${presenza.studente.cognome}`}</td>
                  <td>
                    {presenza.stati.map((stato, i) => (
                      <span
                        key={i}
                        className={`stato-indicatore ${
                          stato === "presente" ? "stato-presente" : "stato-assente"
                        }`}
                      ></span>
                    ))}
                  </td>
                  <td>
                    {presenza.entrateRitardo.length > 0
                      ? presenza.entrateRitardo.join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    {presenza.usciteAnticipate.length > 0
                      ? presenza.usciteAnticipate.join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    {presenza.giustificazioni.length > 0
                      ? "Giustificato"
                      : "Non giustificato"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Nessuna presenza registrata per oggi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div> 
    </div>
  );
}

// PropTypes per garantire la correttezza dei dati passati
VisualizzaRegistro.propTypes = {
  presenze: PropTypes.arrayOf(
    PropTypes.shape({
      studente: PropTypes.shape({
        nome: PropTypes.string.isRequired,
        cognome: PropTypes.string.isRequired,
      }),
      stato: PropTypes.string.isRequired, // "presente" o "assente"
      entrata_ritardo: PropTypes.string,
      uscita_anticipata: PropTypes.string,
      giustificazione: PropTypes.bool,
    })
  ),
};

export default VisualizzaRegistro;
