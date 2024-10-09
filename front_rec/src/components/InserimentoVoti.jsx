import { useState } from 'react';
import { studenti } from './mockdb'; // Importiamo i dati degli studenti
import '../css/Registro.css'; // Puoi riutilizzare gli stili del Registro

function InserimentoVoti({ selectedClass }) {
    const [voti, setVoti] = useState({}); // Stato per gestire i voti inseriti
    const studentiClasse = studenti.filter(studente => studente.classeId === selectedClass.id); // Filtra gli studenti in base alla classe selezionata

    // Funzione per aggiornare i voti scritti e orali di uno studente
  const handleVotoChange = (studenteId, tipoVoto, valore) => {
    setVoti(prevVoti => ({
      ...prevVoti,
      [studenteId]: {
        ...prevVoti[studenteId],
        [tipoVoto]: valore
      }
    }));
  };

  // Funzione per salvare i voti di uno studente
  const handleSalvaVoti = (studenteId) => {
    const votiStudente = voti[studenteId] || {};
    const votoScritto = votiStudente.scritto || '';
    const votoOrale = votiStudente.orale || '';
    
    // Logica per salvare i voti (qui potresti fare una chiamata API o aggiornare un database locale)
    console.log(`Voti salvati per studente ID ${studenteId}: Scritto = ${votoScritto}, Orale = ${votoOrale}`);
    
    // Potresti anche resettare i voti dello studente se desideri pulire il form dopo il salvataggio
  };

  return (
    <div className="class-details">
      <h3>Inserisci voti per la classe {selectedClass.anno}{selectedClass.sezione}</h3>
      
      <table className="registro-table">
        <thead>
          <tr>
            <th>Studente</th>
            <th>Voto scritto</th>
            <th>Voto orale</th>
            <th>Azioni</th> {/* Aggiungiamo una colonna per il bottone */}
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
                  placeholder="Inserisci voto" 
                  value={voti[studente.id]?.scritto || ''} // Mostra il valore salvato o un vuoto
                  onChange={(e) => handleVotoChange(studente.id, 'scritto', e.target.value)} // Gestisce il cambiamento del voto scritto
                />
              </td>
              <td>
                <input 
                  type="number" 
                  min="0" 
                  max="10" 
                  placeholder="Inserisci voto" 
                  value={voti[studente.id]?.orale || ''} // Mostra il valore salvato o un vuoto
                  onChange={(e) => handleVotoChange(studente.id, 'orale', e.target.value)} // Gestisce il cambiamento del voto orale
                />
              </td>
              <td>
                <button onClick={() => handleSalvaVoti(studente.id)}>Salva</button> {/* Bottone per salvare i voti */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InserimentoVoti;
