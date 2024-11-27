import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { authFetch } from "./authUtils";
import "../css/RegistroStudente.css";

function RegistroStudente({ utenteLoggato }) {
  const [assenze, setAssenze] = useState([]); // Stato per le assenze
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per eventuali errori

  // Fetch per ottenere solo le assenze dello studente loggato
  useEffect(() => {
    const fetchAssenze = async () => {
      setLoading(true); // Imposta lo stato di caricamento
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
        setAssenze(data); // Imposta le assenze ottenute dal backend
      } catch (err) {
        setError(err.message || "Errore sconosciuto");
      } finally {
        setLoading(false); // Disabilita lo stato di caricamento
      }
    };

    fetchAssenze();
  }, []);

  // Gestione del caricamento
  if (loading) return <p>Caricamento in corso...</p>;

  // Gestione degli errori
  if (error) return <p>Errore: {error}</p>;

  // Render della tabella delle assenze
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
          {assenze.length > 0 ? (
            assenze.map((assenza, index) => (
              <tr key={index}>
                <td>{assenza.data}</td>
                <td>Assente</td> {/* Mostra "Assente" perché il backend filtra solo le assenze */}
                <td>{assenza.entrata_ritardo || "Nessuna"}</td>
                <td>{assenza.uscita_anticipata || "Nessuna"}</td>
                <td>{assenza.giustificazione ? "Giustificato" : "Non giustificato"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nessuna assenza registrata</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// PropTypes per validare le props
RegistroStudente.propTypes = {
  utenteLoggato: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    cognome: PropTypes.string.isRequired,
  }).isRequired,
};

export default RegistroStudente;
