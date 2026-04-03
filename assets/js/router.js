const Router = {
    // Ez indul el legelőször, amikor betölt az oldal
    init: () => {
        // Figyeljük, ha a felhasználó kattint egy linkre (megváltozik a hash)
        window.addEventListener('hashchange', Router.handleRoute);
        // Akkor is lefut, amikor először betöltjük (frissítjük) az oldalt
        window.addEventListener('load', Router.handleRoute);
    },

    // Ez a függvény dönti el, hova megyünk
    handleRoute: () => {
        let hash = window.location.hash;

        // Ha nincs hash (pl. csak simán a főoldalra jött a user), küldjük a loginra
        if (!hash) {
            window.location.hash = '#login';
            return; // A hash megváltoztatása újra meghívja ezt a függvényt
        }

        // --- BIZTONSÁGI ELLENŐRZÉS ---
        const isLoggedIn = Auth.isLoggedIn();

        // Ha nincs belépve, és nem is a login/register oldalon van -> irány a login!
        if (!isLoggedIn && hash !== '#login' && hash !== '#register') {
            window.location.hash = '#login';
            return;
        }

        // Ha már be van lépve, de a login/register oldalra tévedne -> irány a főoldal!
        if (isLoggedIn && (hash === '#login' || hash === '#register')) {
            window.location.hash = '#home';
            return;
        }

        // --- ÚTVONALAK (ROUTING) ---
        if (hash === '#login') {
            UI.renderLogin();
        } 
        else if (hash === '#register') {
            UI.renderRegister(); 
        } 
        else if (hash === '#home') {
            UI.renderHome(); 
        } 
        // ÚJ: Új recept hozzáadása nézet
        else if (hash === '#add-recipe') {
            UI.renderAddRecipe(); 
        }
        // FRISSÍTVE: Recept részletei
        else if (hash.startsWith('#recipe/')) {
            // Kinyerjük az ID-t a hash-ből (pl. "#recipe/5" -> "5")
            const recipeId = hash.split('/')[1];
            // Most már élesben hívjuk a UI réteget!
            UI.renderRecipeDetails(recipeId); 
        } 
        else {
            // Ha ismeretlen helyre ment
            UI.appContainer.innerHTML = `
                <div class="container" style="text-align: center;">
                    <h2>404 - Az oldal nem található</h2>
                    <br>
                    <a href="#home" style="display:inline-block; padding:10px; background:#28a745; color:white; text-decoration:none; border-radius:4px;">Vissza a főoldalra</a>
                </div>
            `;
        }
    }
};

// Indítjuk a routert!
Router.init();