import PropTypes from "prop-types";
import { useState } from 'react';
import '../css/Registro.css';
import { studenti } from './mockdb';
import VisualizzaRegistro from './VisualizzaRegistro'; // Importa il nuovo componente

function Registro({ selectedClass, onSubmit }) {
  const [statoPresenze, setStatoPresenze] = useState({});
  const [entrataRitardo, setEntrataRitardo] = useState({});
  const [uscitaAnticipata, setUscitaAnticipata] = useState({});
  const [confermaGiustificazione, setConfermaGiustificazione] = useState({});
  const [mostraVisualizzaRegistro, setMostraVisualizzaRegistro] = useState(false); // Stato per mostrare/nascondere VisualizzaRegistro
  const [datiPresenze, setDatiPresenze] = useState([]); // Nuovo stato per i dati delle presenze

  // Recupera gli studenti della classe selezionata
  const studentiClasse = studenti.filter(studente => studente.classeId === selectedClass.id);

 // Funzione per gestire il cambio di presenza
const togglePresenza = (studenteId) => {
  setStatoPresenze(prevStato => ({
    ...prevStato,
    [studenteId]: prevStato[studenteId] === "Presente" ? "Assente" : "Presente"
  }));
};

  // Funzione per gestire l'entrata in ritardo
  const handleEntrataChange = (studenteId, time) => {
    setEntrataRitardo(prev => ({
      ...prev,
      [studenteId]: time
    }));
  };

  // Funzione per gestire l'uscita anticipata
  const handleUscitaChange = (studenteId, time) => {
    setUscitaAnticipata(prev => ({
      ...prev,
      [studenteId]: time
    }));
  };

  const handleConfermaGiustificazioneChange = (studenteId, confermato) => {
    setConfermaGiustificazione(prev => ({
      ...prev,
      [studenteId]: confermato
    }));
  };

  // Funzione per salvare le presenze
  const handleSubmit = () => {
    const presenzeDaInviare = studentiClasse.map(studente => ({
      nome: studente.nome,
      cognome: studente.cognome,
      dataNascita: studente.dataNascita,
      presenza: statoPresenze[studente.id] || "Presente", // Predefinito a "Presente"
      entrataRitardo: entrataRitardo[studente.id] || "",
      uscitaAnticipata: uscitaAnticipata[studente.id] || "",
      giustificazioneConfermata: confermaGiustificazione[studente.id] || false, // Aggiunge la conferma della giustificazione
    }));

    // Salva i dati delle presenze nello stato
    setDatiPresenze(presenzeDaInviare);
    onSubmit(presenzeDaInviare); // Invia i dati
  };

  // Condizione per mostrare VisualizzaRegistro
  if (mostraVisualizzaRegistro) {
    return (
      <VisualizzaRegistro
        presenze={datiPresenze} // Passa i dati delle presenze
        onBack={() => setMostraVisualizzaRegistro(false)} // Funzione per tornare a Registro
      />
    );
  }

  return (
    <div className="class-details">
      <h3>Registro della classe {selectedClass.anno}{selectedClass.sezione}</h3>

      <button onClick={() => setMostraVisualizzaRegistro(true)}>Mostra Visualizza Registro</button>

      <table className="registro-table">
        <thead>
          <tr>
            <th>Studente</th>
            <th>Data di nascita</th>
            <th>Presenza</th>
            <th>Entrata in Ritardo</th>
            <th>Uscita anticipata</th>
            <th>Giustificazione</th>
          </tr>
        </thead>
        <tbody>
          {studentiClasse.map(studente => {
            const stato = statoPresenze[studente.id] || "Presente"; // Stato predefinito "Presente"
            const rigaClasse = stato === "Presente" ? 'riga-verde' : 'riga-rossa'; // Assegna la classe in base allo stato

            return (
              <tr key={studente.id} className={rigaClasse}>
                <td>{studente.nome} {studente.cognome}</td>
                <td>{studente.dataNascita}</td>
                <td>
                <button 
                  id={`presenza-${studente.id}`}  // Aggiungi id univoco
                  name={`presenza-${studente.id}`}  // Aggiungi name univoco
                  onClick={() => togglePresenza(studente.id)}
                  className={stato === "Presente" ? "presente-btn" : "assente-btn"}
                >
                  {stato}
                </button>
                </td>
                <td>
                <input 
                  type="time" 
                  id={`entrata-${studente.id}`}  // Aggiungi id univoco
                  name={`entrata-${studente.id}`}  // Aggiungi name univoco
                  onChange={(e) => handleEntrataChange(studente.id, e.target.value)} 
                />
                </td>
                <td>
                <input 
                  type="time" 
                  id={`uscita-${studente.id}`}  // Aggiungi id univoco
                  name={`uscita-${studente.id}`}  // Aggiungi name univoco
                  onChange={(e) => handleUscitaChange(studente.id, e.target.value)} 
                />
                </td>
                <td>
                  <input 
                    type="checkbox"
                    id={`giustifica-${studente.id}`}  // Aggiungi id univoco
                    name={`giustifica-${studente.id}`}  // Aggiungi name univoco
                    onChange={(e) => handleConfermaGiustificazioneChange(studente.id, e.target.checked)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Firma</button>
    </div>
  );
}

// Definizione delle PropTypes
Registro.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Accetta sia stringa che numero
    sezione: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Registro;
