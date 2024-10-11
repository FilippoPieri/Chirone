import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { voti as votiMockDb } from './mockdb'; // Importiamo i voti e studenti dal mockdb

function VisualizzaVoti({ studentiClasse }) {
  const [voti, setVoti] = useState(votiMockDb); // State per i voti

  // Funzione per aggiornare i voti
  const aggiornaVoti = (nuovoVoto) => {
    setVoti((prevVoti) => {
      // Controlla se il voto esiste già
      const votoEsistenteIndex = prevVoti.findIndex(voto => 
        voto.studenteId === nuovoVoto.studenteId && voto.materiaId === nuovoVoto.materiaId
      );

      if (votoEsistenteIndex !== -1) {
        // Se esiste, aggiorna il voto
        const updatedVoti = [...prevVoti];
        updatedVoti[votoEsistenteIndex] = nuovoVoto;
        return updatedVoti;
      } else {
        // Altrimenti, aggiungi il nuovo voto
        return [...prevVoti, nuovoVoto];
      }
    });
  };

  return (
    <div className="voti-salvati">
      <h4>Voti Salvati</h4>
      <table className="registro-table">
        <thead>
          <tr>
            <th>Studente</th>
            <th>Voti Scritti</th>
            <th>Voti Orali</th>
          </tr>
        </thead>
        <tbody>
          {studentiClasse.map(studente => {
            // Filtra i voti dello studente dal mockdb
            const votiStudente = voti.filter(voto => voto.studenteId === studente.id);
            const votoScritto = votiStudente.find(voto => voto.materiaId === 1); // ID materia per i voti scritti
            const votoOrale = votiStudente.find(voto => voto.materiaId === 2); // ID materia per i voti orali
            
            return (
              <tr key={studente.id}>
                <td>{studente.nome} {studente.cognome}</td>
                <td>{votoScritto ? votoScritto.scritto : 'N/D'}</td>
                <td>{votoOrale ? votoOrale.orale : 'N/D'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Esempio di utilizzo di aggiornaVoti */}
      {/* <button onClick={() => aggiornaVoti({ studenteId: 1, materiaId: 1, scritto: 8 })}>
        Aggiungi Voto Scritto
      </button> */}
    </div>
  );
}

VisualizzaVoti.propTypes = {
  studentiClasse: PropTypes.array.isRequired, // Lista degli studenti della classe selezionata
};

export default VisualizzaVoti;
