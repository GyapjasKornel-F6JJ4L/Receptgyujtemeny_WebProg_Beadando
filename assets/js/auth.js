const Auth = {
    // Bejelentkezett felhasználó adatainak lekérése
    getUser: () => {
        return JSON.parse(localStorage.getItem('user')) || null;
    },

    isLoggedIn: () => {
        return Auth.getUser() !== null;
    },

    // Kijelentkezés
    logout: () => {
        localStorage.removeItem('user');
        window.location.hash = '#login'; // Visszairányítás a login oldalra
    },

    // Bejelentkezés küldése az API-nak
    login: async (username, password) => {
        try {
            const response = await fetch('api/auth.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', username, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Sikeres belépés: mentsük el az adatokat!
                localStorage.setItem('user', JSON.stringify(data.user));
                alert(`Üdvözlünk, ${data.user.username}!`);
                window.location.hash = '#home'; // Tovább az ista oldalra
            } else {
                alert("Hiba: " + data.error);
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
        }
    }
};