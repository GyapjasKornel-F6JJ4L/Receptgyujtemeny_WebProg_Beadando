// UI modul: a felhasználói felület nézeteit készíti el és helyezi be az #app konténerbe.
// Ez a modul mutatja a főoldalt, bejelentkezési és regisztrációs űrlapokat,
// és futtatja a backend hívásokat a receptek lekéréséhez.
const UI = {
    appContainer: document.getElementById('app'),

    // Bejelentkező nézet kirajzolása
    renderLogin: () => {
        UI.appContainer.innerHTML = `
            <div class="app-card mt-5" style="max-width: 420px; margin:auto;">
                <h2 class="mb-4 text-center">Bejelentkezés</h2>
                <div class="mb-3"><input type="text" id="login-username" class="form-control" placeholder="Felhasználónév" required></div>
                <div class="mb-3"><input type="password" id="login-password" class="form-control" placeholder="Jelszó" required></div>
                <div class="d-grid gap-2"><button id="login-btn" class="btn btn-primary">Belépés</button></div>
                <p class="text-center mt-3">Nincs még fiókod? <a href="#register">Regisztrálj itt!</a></p>
            </div>
        `;

        document.getElementById('login-btn')?.addEventListener('click', () => {
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            Auth.login(username, password);
        });
    },

    // Regisztrációs nézet és form eseménykezelés
    renderRegister: () => {
        UI.appContainer.innerHTML = `
            <div class="app-card mt-5" style="max-width: 420px; margin:auto;">
                <h2 class="mb-4 text-center">Regisztráció</h2>
                <div class="mb-3"><input type="text" id="reg-username" class="form-control" placeholder="Felhasználónév" required></div>
                <div class="mb-3"><input type="email" id="reg-email" class="form-control" placeholder="E-mail cím (opcionális)"></div>
                <div class="mb-3"><input type="password" id="reg-password" class="form-control" placeholder="Jelszó" required></div>
                <div class="mb-3"><input type="password" id="reg-password-confirm" class="form-control" placeholder="Jelszó újra" required></div>
                <div class="d-grid gap-2"><button id="reg-btn" class="btn btn-primary">Regisztráció</button></div>
                <p class="text-center mt-3">Már van fiókod? <a href="#login">Lépj be itt!</a></p>
            </div>
        `;

        document.getElementById('reg-btn')?.addEventListener('click', () => {
            const username = document.getElementById('reg-username').value.trim();
            const email = document.getElementById('reg-email').value.trim() || null;
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-password-confirm').value;

            if (password !== confirm) {
                alert('A jelszavak nem egyeznek.');
                return;
            }

            Auth.register(username, password, email);
        });
    },

    // Főoldal megjelenítése:
    // - frissül a header (felhasználó, logout, add recipe gomb)
    // - elindul a receptek lekérése az API-ból
    // - kártyák renderelése a táblázat helyére
    renderHome: async () => {
        const isLoggedIn = Auth.isLoggedIn();
        const user = isLoggedIn ? Auth.getUser() : null;

        UI.appContainer.innerHTML = `
            <div class="app-card mt-5">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h4">Receptgyűjtemény</h1>
                    <div id="home-header"></div>
                </div>
                <div class="row" id="recipe-list"></div>
                <div class="text-center mt-4" id="loading"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Betöltés...</span></div></div>
                <div class="text-center mt-4 d-none" id="no-recipes"><p class="text-muted">Még nincsenek receptek. Legyen Ön az első, aki hozzáad egyet!</p><a href="#add-recipe" class="btn btn-success">Új recept hozzáadása</a></div>
            </div>
        `;

        const header = document.getElementById('home-header');
        if (header) {
            header.innerHTML = isLoggedIn
                ? `Szia, <strong>${user.username}</strong>! <a href="#add-recipe" class="btn btn-sm btn-outline-primary ms-2">+ Új recept</a> <button id="logout-btn" class="btn btn-sm btn-outline-danger ms-2">Kijelentkezés</button>`
                : '<span>Fedezd fel a recepteket!</span>';
        }

        document.getElementById('logout-btn')?.addEventListener('click', Auth.logout);

        const data = await Api.call(API_ACTIONS.GET_RECIPES);
        const listContainer = document.getElementById('recipe-list');
        document.getElementById('loading')?.classList.add('d-none');

        if (data.error) {
            listContainer.innerHTML = `<div class="alert alert-danger">Hiba: ${data.error}</div>`;
            return;
        }

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById('no-recipes')?.classList.remove('d-none');
            return;
        }

        listContainer.innerHTML = '';
        data.forEach((recipe) => listContainer.insertAdjacentHTML('beforeend', UI.buildRecipeCard(recipe)));
    },

    // Csak a bejelentkezett felhasználó saját receptjei (Profil → Receptjeim)
    renderMyRecipes: async () => {
        const user = Auth.getUser();
        if (!user) {
            window.location.hash = '#login';
            return;
        }

        UI.appContainer.innerHTML = `
            <div class="app-card mt-5">
                <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h1 class="h4 mb-0">Receptjeim</h1>
                    <div>
                        <a href="#home" class="btn btn-sm btn-outline-secondary">Összes recept</a>
                        <a href="#add-recipe" class="btn btn-sm btn-primary ms-1">+ Új recept</a>
                    </div>
                </div>
                <div class="row" id="my-recipe-list"></div>
                <div class="text-center mt-4" id="my-loading"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Betöltés...</span></div></div>
                <div class="text-center mt-4 d-none" id="my-no-recipes">
                    <p class="text-muted">Még nincs saját recepted.</p>
                    <a href="#add-recipe" class="btn btn-success">Új recept hozzáadása</a>
                </div>
            </div>
        `;

        const data = await Api.call(API_ACTIONS.GET_MY_RECIPES, { user_id: user.id });
        const listContainer = document.getElementById('my-recipe-list');
        document.getElementById('my-loading')?.classList.add('d-none');

        if (data.error) {
            listContainer.innerHTML = `<div class="alert alert-danger">Hiba: ${data.error}</div>`;
            return;
        }

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById('my-no-recipes')?.classList.remove('d-none');
            return;
        }

        listContainer.innerHTML = '';
        data.forEach((recipe) => listContainer.insertAdjacentHTML('beforeend', UI.buildRecipeCard(recipe)));
    },

    // Recepteket megjelenítő kártya HTML sablonja
    buildRecipeCard: (recipe = {}) => {
        const id = recipe.id ?? '0';
        const img = recipe.image || 'https://via.placeholder.com/400x250?text=Recept';
        const title = recipe.title || 'Ismeretlen recept';
        const desc = recipe.description || 'Leírás nem elérhető.';
        const type = recipe.type ? `<span class="badge bg-success">${recipe.type}</span>` : '';

        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${img}" class="card-img-top" alt="${title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text text-truncate" style="max-height: 4.8em;">${desc}</p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            ${type}
                            <a href="#recipe/${id}" class="btn btn-primary btn-sm">Megtekintés</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Új recept oldal ideiglenes sablonja (fejlesztés alatt)
    renderAddRecipe: () => {
        const user = Auth.getUser();
        if (!user) {
            UI.appContainer.innerHTML = `
                <div class="app-card mt-5" style="max-width: 700px; margin:auto;">
                    <p>Be kell jelentkezned ahhoz, hogy recept hozzáadass.</p>
                    <a href="#login" class="btn btn-primary">Bejelentkezés</a>
                </div>
            `;
            return;
        }

        UI.appContainer.innerHTML = `
            <div class="app-card mt-5" style="max-width: 700px; margin:auto;">
                <a href="#home" class="text-decoration-none mb-3 d-inline-block">⬅ Vissza</a>
                <h2>Új recept hozzáadása</h2>
                <form id="add-recipe-form">
                    <div class="mb-3">
                        <label for="recipe-title" class="form-label">Recept neve</label>
                        <input type="text" class="form-control" id="recipe-title" placeholder="Recept neve" required>
                    </div>
                    <div class="mb-3">
                        <label for="recipe-description" class="form-label">Leírás</label>
                        <textarea class="form-control" id="recipe-description" rows="3" placeholder="Recept leírása"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="recipe-category" class="form-label">Kategória</label>
                        <select class="form-control" id="recipe-category">
                            <option value="1">Levesek</option>
                            <option value="2">Főételek</option>
                            <option value="3">Desszertek</option>
                            <option value="4">Saláták</option>
                            <option value="5">Reggelik</option>
                        </select>
                    </div>
                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary">Hozzáadás</button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('add-recipe-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('recipe-title').value.trim();
            const description = document.getElementById('recipe-description').value.trim();
            const categoryId = document.getElementById('recipe-category').value;

            if (!title) {
                alert('A recept neve kötelező!');
                return;
            }

            try {
                const result = await Api.call(API_ACTIONS.ADD_RECIPE, {
                    user_id: user.id,
                    title,
                    description,
                    category_id: categoryId
                });

                if (result.success) {
                    alert('Recept sikeresen hozzáadva!');
                    window.location.hash = '#home';
                } else {
                    alert(result.error || 'Hiba a recept hozzáadásakor');
                }
            } catch (error) {
                console.error('Hiba:', error);
                alert('Szerverhiba történt');
            }
        });
    },

    // Recept részleteinek lekérése és megjelenítése
    renderRecipeDetails: async (id) => {
        UI.appContainer.innerHTML = `
            <div class="app-card mt-5" style="max-width: 900px; margin:auto;">
                <a href="#home" class="text-decoration-none mb-3 d-inline-block">⬅ Vissza</a>
                <h2>Recept részletei</h2>
                <div id="recipe-content" class="mt-3">Betöltés...</div>
            </div>
        `;

        const data = await Api.call(API_ACTIONS.GET_RECIPE_DETAILS, { id });
        const container = document.getElementById('recipe-content');

        if (data.error) {
            container.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
            return;
        }

        if (!data || !data.title) {
            container.innerHTML = '<div class="alert alert-warning">Recept nem található.</div>';
            return;
        }

        container.innerHTML = `
            <img src="${data.image || 'https://via.placeholder.com/800x400?text=Nincs+kép'}" class="img-fluid rounded mb-3" alt="${data.title}">
            <p><strong>Kategória:</strong> ${data.type || data.category || 'N/A'}</p>
            <p>${data.description || 'Nincs leírás.'}</p>
            <h5>Hozzávalók</h5>
            <pre>${data.ingredients || '-'}</pre>
            <h5>Elkészítés</h5>
            <pre>${data.instructions || '-'}</pre>
        `;
    },
};