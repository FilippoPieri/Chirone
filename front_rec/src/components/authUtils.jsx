// authUtils.js
export async function refreshToken() {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
        console.error('Refresh token non trovato');
        return null;
    }

    try {
        const response = await fetch('http://localhost:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access);
            return data.access;
        } else {
            console.error('Impossibile rinnovare il token');
            return null;
        }
    } catch (error) {
        console.error('Errore durante il refresh del token:', error);
        return null;
    }
}

export async function authFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        };
    }

    let response = await fetch(url, options);

    // Se il token è scaduto, prova a rinnovarlo
    if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
            options.headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, options); // Ripeti la richiesta
        }
    }

    return response;
}
