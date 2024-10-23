import PropTypes from 'prop-types';
import { useState } from 'react';
import { studenti, materie, voti as votiMockDb } from './mockdb'; // Importiamo i dati degli studenti e voti
import VisualizzaVoti from './VisualizzaVoti'; // Importiamo il nuovo componente VisualizzaVoti
import '../css/Registro.css'; // Puoi riutilizzare gli stili del Registro

function InserimentoVoti({ selectedClass, utenteLoggato }) {
  const [voti, setVoti] = useState({});
  const [visualizzazione, setVisualizzazione] = useState('inserimento');
  const [mostraAppunti, setMostraAppunti] = useState({}); // Stato per gestire la visualizzazione del campo appunti

  // Filtra gli studenti della classe selezionata
  const studentiClasse = studenti.filter(studente => studente.classeId === selectedClass.id); 
  // Trova la materia che insegna l'insegnante loggato
  const materiaInsegnante = materie.find(materia => materia.insegnanteId === utenteLoggato.id);

  const handleVotoChange = (studenteId, tipoVoto, valore) => {
    setVoti(prevVoti => ({
      ...prevVoti,
      [studenteId]: {
        ...prevVoti[studenteId],
        [tipoVoto]: valore
      }
    }));
  };

  const handleAppuntiChange = (studenteId, appunti) => {
    setVoti(prevVoti => ({
      ...prevVoti,
      [studenteId]: {
        ...prevVoti[studenteId],
        appunti: appunti
      }
    }));
  };

  const handleSalvaTuttiVoti = () => {
    studentiClasse.forEach(studente => {
      const votiStudente = voti[studente.id] || {};
      const votoScritto = votiStudente.scritto || '';
      const votoOrale = votiStudente.orale || '';
      const appunti = votiStudente.appunti || 'Nessun appunto';
  
    // Creiamo un oggetto per raccogliere i voti da inviare
    const votiDaInviare = {};
  
    // Aggiungiamo solo i campi riempiti all'oggetto da inviare
    if (votoScritto) {
      votiDaInviare.scritto = votoScritto;
    }
  
    if (votoOrale) {
      votiDaInviare.orale = votoOrale;  // Aggiungiamo il voto orale solo se non è vuoto
    }
  
    // Gestiamo gli appunti
    votiDaInviare.appunti = appunti || "Nessun appunto"; // Se appunti è vuoto, inviamo il messaggio "Nessun appunto"
  
    // Aggiungi i voti nel mock database solo se ci sono valori da salvare
    if (Object.keys(votiDaInviare).length > 0) {
      votiMockDb.push({
        id: votiMockDb.length + 1,
        studenteId: studente.id,
        materiaId: materiaInsegnante.id,  // Associa il voto alla materia dell'insegnante
        ...votiDaInviare, // Includiamo solo i campi riempiti
        data: new Date().toISOString().split('T')[0] // Data odierna
      });
    }
  });
  
  console.log('Tutti i voti sono stati salvati:', voti);
  };
    
  
  const mostraVisualizzaVoti = () => {
    setVisualizzazione('visualizza');
  };

  const mostraInserimentoVoti = () => {
    setVisualizzazione('inserimento');
  };

  const toggleAppunti = (studenteId) => {
    setMostraAppunti(prevState => ({
      ...prevState,
      [studenteId]: !prevState[studenteId] // Cambia la visibilità per lo specifico studente
    }));
  };

   return (
    <div className="inserimento-voti">
      <h3>Gestione voti per la classe {selectedClass.anno}{selectedClass.sezione}</h3>
      {visualizzazione === 'inserimento' ? (
        <>
          <button onClick={mostraVisualizzaVoti}>Visualizza Voti</button>
          <table className="registro-table">
            <thead>
              <tr>
                <th>Studente</th>
                <th>Voto scritto</th>
                <th>Voto orale</th>
                <th>Appunti</th>
              </tr>
            </thead>
            <tbody>
              {studentiClasse.map(studente => (
                <tr key={studente.id}>
                  <td>{studente.nome} {studente.cognome}</td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="10" 
                      id={`scritto-${studente.id}`} // Aggiungi id univoco
                      name={`scritto-${studente.id}`} // Aggiungi name univoco
                      placeholder="Inserisci voto" 
                      value={voti[studente.id]?.scritto || ''}
                      onChange={(e) => handleVotoChange(studente.id, 'scritto', e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="10" 
                      id={`orale-${studente.id}`} // Aggiungi id univoco
                      name={`orale-${studente.id}`} // Aggiungi name univoco
                      placeholder="Inserisci voto" 
                      value={voti[studente.id]?.orale || ''}
                      onChange={(e) => handleVotoChange(studente.id, 'orale', e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Pulsante che apre/chiude il campo degli appunti */}
                    <button onClick={() => toggleAppunti(studente.id)}>
                      {mostraAppunti[studente.id] ? 'Nascondi Appunti' : 'Aggiungi Appunti'}
                    </button>
                    {mostraAppunti[studente.id] && (
                      <textarea 
                        id={`appunti-${studente.id}`} // Aggiungi id univoco
                        name={`appunti-${studente.id}`} // Aggiungi name univoco
                        placeholder="Scrivi appunti"
                        value={voti[studente.id]?.appunti || ''}
                        onChange={(e) => handleAppuntiChange(studente.id, e.target.value)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSalvaTuttiVoti}>Salva Tutti i Voti</button>
        </>
      ) : (
        <>
          <button onClick={mostraInserimentoVoti}>Torna Indietro</button>
          <VisualizzaVoti studentiClasse={studentiClasse} materiaInsegnante={materiaInsegnante}/>
        </>
      )}
    </div>
  );
}

// Definizione delle PropTypes
InserimentoVoti.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Accetta sia stringa che numero
    sezione: PropTypes.string.isRequired
  }).isRequired,
  utenteLoggato: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired  // Aggiungi anche qui per assicurarti che `utenteLoggato` sia richiesto
};

export default InserimentoVoti;