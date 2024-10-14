import PropTypes from "prop-types";
import { orariLezione, materie} from './mockdb'; // Assicurati di importare i dati corretti
import '../css/VisualizzaOrario.css'; // Aggiungi un file CSS se necessario

function VisualizzaOrario({ selectedClass }) {
  const getOrarioSettimana = (classeId) => {
    return orariLezione
      .filter(orario => orario.classeId === classeId)
      .map(orario => ({
        ...orario,
        materia: materie.find(materia => materia.id === orario.materiaId)?.nomeMateria,
      }));
  };

  const orariClasse = getOrarioSettimana(selectedClass.id);

  // Raggruppiamo l'orario per ora e giorno
  const orarioMatrice = {};
  const giorniSettimana = new Set(); // Per raccogliere i giorni unic

   // Popoliamo la matrice con le ore e le materie
   orariClasse.forEach((orario) => {
    const { oraInizio, giorno, materia } = orario;

    // Aggiungi il giorno all'insieme di giorni
    giorniSettimana.add(giorno);

    // Aggiungi l'ora all'oggetto se non esiste
    if (!orarioMatrice[oraInizio]) {
      orarioMatrice[oraInizio] = {
        ora: oraInizio,
        ...Object.fromEntries([...giorniSettimana].map(g => [g.toLowerCase(), ''])), // Inizializza tutti i giorni
      };
    }

    // Aggiungi la materia corrispondente al giorno corretto
    orarioMatrice[oraInizio][giorno.toLowerCase()] = materia;
  });

  // Convertiamo l'oggetto in un array per l'iterazione e ordiniamo le ore
  const orarioArray = Object.values(orarioMatrice).sort((a, b) => a.ora.localeCompare(b.ora));

  return (
    <div className="orario-settimanale">
      <h4>Orario Settimanale per la classe {selectedClass.anno}{selectedClass.sezione}</h4>
      <table className="orario-table">
        <thead>
          <tr>
            <th>Ora</th>
            {[...giorniSettimana].map(giorno => (
              <th key={giorno}>{giorno.charAt(0).toUpperCase() + giorno.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orarioArray.length === 0 ? (
            <tr>
              <td colSpan={giorniSettimana.size + 1}>Nessuna lezione programmata per questa classe.</td>
            </tr>
          ) : (
            orarioArray.map((orario, index) => (
              <tr key={index}>
                <td>{orario.ora}</td>
                {[...giorniSettimana].map(giorno => (
                  <td key={giorno}>{orario[giorno.toLowerCase()]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Validazione delle proprietà
VisualizzaOrario.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anno: PropTypes.number.isRequired,
    sezione: PropTypes.string.isRequired,
  }).isRequired,
};

export default VisualizzaOrario;