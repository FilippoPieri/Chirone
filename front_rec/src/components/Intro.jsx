import { useState } from 'react';
import '../css/Intro.css';
import PropTypes from 'prop-types';

function Intro({ setLoggedIn, loggedIn, setUtenteLoggato, utenteLoggato, handleLogout }) {
    const [username, setUsername] = useState(''); // Stato per lo username
    const [password, setPassword] = useState(''); // Stato per memorizzare la password
    const [error, setError] = useState(''); // Stato per memorizzare l'errore

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginUrl = 'http://localhost:8000/api/login/';

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access);
                localStorage.setItem('refresh', data.refresh);
                setLoggedIn(true);
                setUtenteLoggato({
                    username: username,
                    id: data.id,
                    nome: data.nome || '',
                    cognome: data.cognome || '',
                    ruolo: data.role || 'utente',
                });

                setError('');
                setUsername(''); // Reset dello username dopo il login
                setPassword(''); // Reset della password dopo il login
            } else {
                const errData = await response.json();
                setError(errData.error || 'Credenziali non valide');
            }
        } catch {
            setError('Errore di connessione al server');
        }
    };

    return (
        <section className="intro">
            <h2>Accedi al Registro Scolastico Online</h2>
            {loggedIn ? (
                <div>
                    <p>Benvenut* {utenteLoggato?.nome} {utenteLoggato?.cognome}!</p>
                    <button onClick={handleLogout} className="cta-button">Esci</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Inserisci la tua username"
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Inserisci la tua password"
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit" className="cta-button">Accedi</button>
                </form>
            )}
        </section>
    );
}

Intro.propTypes = {
    setLoggedIn: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    setUtenteLoggato: PropTypes.func.isRequired,
    utenteLoggato: PropTypes.shape({
        username: PropTypes.string,
        ruolo: PropTypes.string,
        nome: PropTypes.string,
        cognome: PropTypes.string,
    }),
    handleLogout: PropTypes.func.isRequired,
};

export default Intro;
