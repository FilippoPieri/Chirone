import { useState } from 'react';
import { materie, insegnanti } from './mockdb'; 
import '../css/OrarioLezioni.css'; // Importa il file CSS qui

function OrarioLezioni({ selectedClass }) {
    console.log("OrarioLezioni renderizzato per la classe:", selectedClass); // Debug
    
    const [orario, setOrario] = useState({
      8: '',
      9: '',
      10: '',
      11: '',
      12: '',
      13: ''
    });
  
    const handleOrarioChange = (ora, materia) => {
      setOrario(prevOrario => ({
        ...prevOrario,
        [ora]: materia
      }));
    };
  
    const handleSalvaOrario = () => {
      console.log("Orario salvato per la classe:", selectedClass, "Orario:", orario);
    };
  
    return (
      <div className="orario-details">
        <h3>Inserisci l'orario per la classe {selectedClass.anno}{selectedClass.sezione}</h3>
        
        <table className="orario-table">
          <thead>
            <tr>
              <th>Ora</th>
              <th>Materia</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(orario).map(ora => (
              <tr key={ora}>
                <td>{ora}:00 - {parseInt(ora) + 1}:00</td>
                <td>
                  <select
                    value={orario[ora]}
                    onChange={(e) => handleOrarioChange(ora, e.target.value)}
                  >
                    <option value="">Seleziona materia</option>
                    {/* Filtriamo le materie associate alla classe selezionata */}
                    {materie.filter(materia => 
                      materia.classiIds.includes(selectedClass.id) // Assicuriamoci che la materia sia per la classe selezionata
                    ).map(materia => {
                      const insegnante = insegnanti.find(insegnante => insegnante.id === materia.insegnanteId);
                      return (
                        <option key={materia.id} value={materia.nomeMateria}>
                          {materia.nomeMateria} - {insegnante ? `${insegnante.nome} ${insegnante.cognome}` : 'N/A'}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <button onClick={handleSalvaOrario}>Salva Orario</button>
      </div>
    );
}
  
export default OrarioLezioni;
