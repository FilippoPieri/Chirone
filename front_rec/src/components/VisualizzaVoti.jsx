import PropTypes from 'prop-types';
import { useState } from 'react';
import { voti as votiMockDb } from './mockdb'; // Importiamo i voti e studenti dal mockdb

function VisualizzaVoti({ studentiClasse }) {
  const [voti] = useState(votiMockDb); // State per i voti

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
            const votiStudente = voti.filter(voto => voto.studenteId === studente.id);
            const votoScritto = votiStudente.find(voto => voto.materiaId === 1);
            const votoOrale = votiStudente.find(voto => voto.materiaId === 2);
            
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
    </div>
  );
}

VisualizzaVoti.propTypes = {
  studentiClasse: PropTypes.array.isRequired, // Lista degli studenti della classe selezionata
};

export default VisualizzaVoti;
