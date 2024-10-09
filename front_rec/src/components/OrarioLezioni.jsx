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
  
    // Trova gli insegnanti della classe selezionata
    const insegnantiClasse = insegnanti.filter(insegnante => {
      return materie.some(materia => materia.id === insegnante.materiaId);
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
                    {/* Mappiamo le materie per gli insegnanti associati alla classe */}
                    {materie.filter(materia => 
                      insegnantiClasse.some(insegnante => insegnante.materiaId === materia.id)
                    ).map(materia => (
                      <option key={materia.id} value={materia.nomeMateria}>
                        {materia.nomeMateria} - {insegnanti.find(insegnante => insegnante.materiaId === materia.id).nome}
                      </option>
                    ))}
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
