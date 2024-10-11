import PropTypes from 'prop-types';
import { useState } from 'react';
import { voti as votiMockDb, materie } from './mockdb'; // Importiamo i voti e le materie

function VisualizzaVoti({ studentiClasse }) {
  const [voti] = useState(votiMockDb); // State per i voti

  return (
    <div className="voti-salvati">
      <h4>Voti per ogni studente</h4>
      <table className="registro-table">
        <thead>
          <tr>
            <th>Studente</th>
            {materie.map((materia) => (
              <th key={materia.id}>{materia.nomeMateria}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentiClasse.map(studente => {
            const votiStudente = voti.filter(voto => voto.studenteId === studente.id);

            return (
              <tr key={studente.id}>
                <td>{studente.nome} {studente.cognome}</td>
                {materie.map(materia => {
                  const votiMateria = votiStudente.filter(voto => voto.materiaId === materia.id);

                  return (
                    <td key={materia.id}>
                      {votiMateria.length > 0 ? (
                        votiMateria.map((voto, index) => (
                          <div key={index}>
                            <p>Data: {voto.data}</p>
                            <p>Scritto: {voto.scritto}</p>
                            <p>Orale: {voto.orale}</p>
                            <hr />
                          </div>
                        ))
                      ) : (
                        <p>N/D</p>
                      )}
                    </td>
                  );
                })}
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
