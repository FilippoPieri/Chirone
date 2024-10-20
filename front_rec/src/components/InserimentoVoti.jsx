import PropTypes from 'prop-types';
import { useState } from 'react';
import { studenti, voti as votiMockDb } from './mockdb'; // Importiamo i dati degli studenti e voti
import VisualizzaVoti from './VisualizzaVoti'; // Importiamo il nuovo componente VisualizzaVoti
import '../css/Registro.css'; // Puoi riutilizzare gli stili del Registro

function InserimentoVoti({ selectedClass }) {
  const [voti, setVoti] = useState({});
  const [visualizzazione, setVisualizzazione] = useState('inserimento');
  const [mostraAppunti, setMostraAppunti] = useState({}); // Stato per gestire la visualizzazione del campo appunti
  
  const studentiClasse = studenti.filter(studente => studente.classeId === selectedClass.id); 

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

  const handleSalvaVoti = (studenteId) => {
    const votiStudente = voti[studenteId] || {};
    const votoScritto = votiStudente.scritto || '';
    const votoOrale = votiStudente.orale || '';
    const appunti = votiStudente.appunti || '';
  
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
        studenteId: studenteId,
        materiaId: 1, // Supponiamo che la materia ID sia 1 per "Matematica"
        ...votiDaInviare, // Includiamo solo i campi riempiti
        data: new Date().toISOString().split('T')[0] // Data odierna
      });
  
      console.log(`Voti salvati per studente ID ${studenteId}:`, votiDaInviare);
      
      // Svuotiamo i campi dopo il salvataggio
      setVoti(prevVoti => ({
        ...prevVoti,
        [studenteId]: {
          scritto: '',
          orale: '',
          appunti: ''
        }
      }));
    }
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
                <th>Azioni</th>
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
                  <td>
                    <button onClick={() => handleSalvaVoti(studente.id)}>Salva</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <button onClick={mostraInserimentoVoti}>Torna Indietro</button>
          <VisualizzaVoti studentiClasse={studentiClasse} />
        </>
      )}
    </div>
  );
}

// Definizione delle PropTypes
InserimentoVoti.propTypes = {
  selectedClass: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anno: PropTypes.string.isRequired,
    sezione: PropTypes.string.isRequired
  }).isRequired
};

export default InserimentoVoti;