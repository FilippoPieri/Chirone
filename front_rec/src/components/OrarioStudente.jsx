import PropTypes from 'prop-types';
import { orariLezione, materie } from './mockdb'; // Importa i dati relativi all'orario e alle materie
import '../css/OrarioStudente.css'; // Stili separati per OrarioStudente

function OrarioStudente({ utenteLoggato }) {
  // Recupera la classe dello studente
  const classeStudente = utenteLoggato.classeId;

  // Funzione per ottenere l'orario settimanale in base alla classe
  const getOrarioSettimana = (classeId) => {
    return orariLezione
      .filter(orario => orario.classeId === classeId)
      .map(orario => ({
        ...orario,
        materia: materie.find(materia => materia.id === orario.materiaId)?.nomeMateria,
      }));
  };

  // Recupera l'orario per la classe dello studente
  const orariClasse = getOrarioSettimana(classeStudente);

  // Raggruppa l'orario per ora e giorno
  const orarioMatrice = {};
  const giorniSettimana = new Set(); // Collezione di giorni unici

  // Popola la matrice con le ore e le materie
  orariClasse.forEach((orario) => {
    const { oraInizio, giorno, materia } = orario;
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

  // Converti l'oggetto in un array per l'iterazione e ordina le ore
  const orarioArray = Object.values(orarioMatrice).sort((a, b) => a.ora.localeCompare(b.ora));

  return (
    <div className="orario-studente-container">
      <h4>Orario Settimanale di {utenteLoggato.nome} {utenteLoggato.cognome}</h4>
      <table className="orario-studente-table">
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

OrarioStudente.propTypes = {
  utenteLoggato: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    cognome: PropTypes.string.isRequired,
    classeId: PropTypes.number.isRequired,
  }).isRequired,
};

export default OrarioStudente;
