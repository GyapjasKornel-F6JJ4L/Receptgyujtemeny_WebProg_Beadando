const UI = {
    appContainer: document.getElementById('app'),

    // --- 1. BEJELENTKEZÉS NÉZET ---
    renderLogin: () => {
        UI.appContainer.innerHTML = `
            <div class="container">
                <h2>Bejelentkezés</h2>
                <input type="text" id="login-username" placeholder="Felhasználónév" required>
                <input type="password" id="login-password" placeholder="Jelszó" required>
                <button id="login-btn">Belépés</button>
                <p style="text-align: center; margin-top: 15px;">
                    Nincs még fiókod? <a href="#register">Regisztrálj itt!</a>
                </p>
            </div>
        `;

        document.getElementById('login-btn').addEventListener('click', () => {
            const user = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;
            Auth.login(user, pass);
        });
    },

    // --- 2. REGISZTRÁCIÓ NÉZET ---
    renderRegister: () => {
        UI.appContainer.innerHTML = `
            <div class="container">
                <h2>Regisztráció</h2>
                <input type="text" id="reg-username" placeholder="Felhasználónév" required>
                <input type="password" id="reg-password" placeholder="Jelszó" required>
                <input type="password" id="reg-password-confirm" placeholder="Jelszó újra" required>
                <button id="reg-btn">Regisztráció</button>
                <p style="text-align: center; margin-top: 15px;">
                    Már van fiókod? <a href="#login">Lépj be itt!</a>
                </p>
            </div>
        `;

        document.getElementById('reg-btn').addEventListener('click', () => {
            const user = document.getElementById('reg-username').value;
            const pass = document.getElementById('reg-password').value;
            const passConfirm = document.getElementById('reg-password-confirm').value;

            if (pass !== passConfirm) {
                alert("A jelszavak nem egyeznek!");
                return;
            }
            Auth.register(user, pass);
        });
    },

    // --- 3. FŐOLDAL (RECEPT LISTA) NÉZET ---
    renderHome: async () => { // Figyeld meg: ez most async lett az adatlekérés miatt!
        const user = Auth.getUser();
        UI.appContainer.innerHTML = `
            <nav>
                <span>Szia, <b>${user.username}</b>!</span>
                <div>
                    <a href="#add-recipe" style="background: #007bff; color: white; padding: 10px; text-decoration: none; border-radius: 4px; margin-right: 10px;">+ Új recept</a>
                    <button id="logout-btn">Kijelentkezés</button>
                </div>
            </nav>
            <div class="container" style="max-width: 600px;">
                <h2>Receptek Listája</h2>
                <div id="recipe-list">Receptek betöltése...</div>
            </div>
        `;

        // Kijelentkezés gomb
        document.getElementById('logout-btn').addEventListener('click', () => {
            Auth.logout();
        });

        // Adatok lekérése a backendről (A TE KORÁBBI LOGIKÁD ÚJRAHASZNOSÍTVA)
        const data = await Api.call('get_receipeName');
        const listContainer = document.getElementById('recipe-list');

        if (data.error) {
            listContainer.innerHTML = `<p style="color:red;">Hiba: ${data.error}</p>`;
        } else {
            listContainer.innerHTML = '<ul style="list-style-type: none; padding: 0;">';
            for (const recipe of data) {
                // Generálunk egy linket minden recepthez, ami átvisz a részletek nézetre
                // Megjegyzés: ehhez a PHP-nak az ID-t is vissza kell adnia!
                let recipeId = recipe.id || 1; 
                listContainer.innerHTML += `
                    <li style="padding: 10px; border-bottom: 1px solid #ddd;">
                        <a href="#recipe/${recipeId}" style="text-decoration: none; color: #333; font-weight: bold; display: block;">
                            🍲 ${recipe.title}
                        </a>
                    </li>
                `;
            }
            listContainer.innerHTML += '</ul>';
        }
    },

    // --- 4. ÚJ RECEPT NÉZET (Vázlat) ---
    renderAddRecipe: () => {
        UI.appContainer.innerHTML = `
            <nav>
                <a href="#home" style="text-decoration: none;">⬅ Vissza a listához</a>
            </nav>
            <div class="container" style="max-width: 600px;">
                <h2>Új recept hozzáadása</h2>
                <p>Ide kerül majd az űrlap a hozzávalókkal és lépésekkel...</p>
            </div>
        `;
    },

    // --- 5. RECEPT RÉSZLETEI NÉZET (Vázlat) ---
    renderRecipeDetails: (id) => {
        UI.appContainer.innerHTML = `
            <nav>
                <a href="#home" style="text-decoration: none;">⬅ Vissza a listához</a>
            </nav>
            <div class="container" style="max-width: 600px;">
                <h2>Recept részletei</h2>
                <p>Betöltjük a(z) <b>${id}</b> azonosítójú recept adatait...</p>
                <div id="recipe-content"></div>
            </div>
        `;
        // Ide fogjuk majd betenni az egyedi lekérdezést, pl: Api.call('get_recipe_details', { id: id })
    }
};