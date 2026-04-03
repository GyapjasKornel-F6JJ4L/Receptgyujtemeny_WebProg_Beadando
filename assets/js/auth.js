// Auth modul: bejelentkezés/logout állapotkezelés és navbar frissítés.
// localStorage-ben tárolja a user-t, hogy a refresh után ne kelljen újra bejelentkezni.
const Auth = {
    // Navigációs menü frissítése a bejelentkezési feltétel alapján.
    // Ha belépett, elrejti a belépés linket és megjeleníti a profil/dropdown menüt.
    updateNavbar: () => {
        const isLoggedIn = Auth.isLoggedIn();
        const loginLink = document.getElementById('login-link');
        const profileDropdown = document.getElementById('profile-dropdown');

        if (isLoggedIn) {
            if (loginLink) loginLink.parentElement.classList.add('d-none');
            if (profileDropdown) profileDropdown.classList.remove('d-none');
        } else {
            if (loginLink) loginLink.parentElement.classList.remove('d-none');
            if (profileDropdown) profileDropdown.classList.add('d-none');
        }
    },

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
        Auth.updateNavbar();
        window.location.hash = '#home';
    },

    // Bejelentkezés funkció
    // Bejelentkezés (backend hívása az api/auth.php-nek)
    // Sikeres bejelentkezés esetén localStorage-be írjuk a felhasználót.
    login: async (username, password) => {
        if (!username || !password) {
            alert('Kérlek, töltsd ki a felhasználónév/jelszó mezőket.');
            return;
        }

        try {
            const result = await Api.call('login', { username, password }, 'auth');
            if (result.success) {
                localStorage.setItem('user', JSON.stringify(result.user));
                alert(`Üdvözöljük, ${result.user.username}!`);
                Auth.updateNavbar();
                window.location.hash = '#home';
            } else {
                alert(result.error || 'Hiba történt a bejelentkezésnél.');
            }
        } catch (error) {
            console.error('Auth hiba:', error);
            alert('Szerverhiba történt, próbáld újra később.');
        }
    },

    register: async (username, password, email = null) => {
        if (!username || !password) {
            alert('Add meg a felhasználónevet és jelszót a regisztrációhoz.');
            return;
        }

        try {
            const result = await Api.call('register', { username, password, email }, 'auth');
            if (result.success) {
                alert('Sikeres regisztráció! Most bejelentkezhetsz.');
                window.location.hash = '#login';
            } else {
                alert(result.error || 'Regisztráció sikertelen.');
            }
        } catch (error) {
            console.error('Regisztrációs hiba:', error);
            alert('Szerverhiba történt a regisztrációnál.');
        }
    },

};

// Auth API-k használata az Api modulon keresztül
// A login/register műveletek így átláthatóan a Api.call() központi logikát használják.