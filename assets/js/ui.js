// UI modul: a felhasználói felület nézeteit készíti el és helyezi be az #app konténerbe.
// Ez a modul mutatja a főoldalt, bejelentkezési és regisztrációs űrlapokat,
// és futtatja a backend hívásokat a receptek lekéréséhez.
const UI = {
    appContainer: document.getElementById('app'),

    // Bejelentkező nézet kirajzolása
    renderLogin: () => {
        UI.appContainer.innerHTML = `
            <div class="container d-flex justify-content-center align-items-center mt-4">
                <div class="app-card w-100" style="max-width: 420px; padding: 40px;">
                    <h2 class="mb-2 text-center fw-bold" style="color: #2c3e50;">🍽️ ReceptMester</h2>
                    <p class="text-center text-muted fw-bold mb-4">Jelentkezz be a folytatáshoz</p>
                    
                    <div class="mb-3">
                        <input type="text" id="login-username" class="form-control" placeholder="Felhasználónév" required>
                    </div>
                    <div class="mb-4">
                        <input type="password" id="login-password" class="form-control" placeholder="Jelszó" required>
                    </div>
                    
                    <div class="d-grid gap-2 mb-4">
                        <button id="login-btn" class="btn-gradient">Belépés</button>
                    </div>
                    
                    <p class="text-center mt-3 mb-0" style="color: #64748b;">Nincs még fiókod? <a href="#register" class="fw-bold" style="color: #16a34a; text-decoration: none;">Regisztrálj itt!</a></p>
                </div>
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
            <div class="container d-flex justify-content-center align-items-center mt-4">
                <div class="app-card w-100" style="max-width: 420px; padding: 40px;">
                    <h2 class="mb-2 text-center fw-bold" style="color: #2c3e50;">🍽️ ReceptMester</h2>
                    <p class="text-center text-muted fw-bold mb-4">Regisztráció</p>
                    
                    <div class="mb-3"><input type="text" id="reg-username" class="form-control" placeholder="Felhasználónév" required></div>
                    <div class="mb-3"><input type="email" id="reg-email" class="form-control" placeholder="E-mail cím (opcionális)"></div>
                    <div class="mb-3"><input type="password" id="reg-password" class="form-control" placeholder="Jelszó" required></div>
                    <div class="mb-4"><input type="password" id="reg-password-confirm" class="form-control" placeholder="Jelszó újra" required></div>
                    
                    <div class="d-grid gap-2 mb-4">
                        <button id="reg-btn" class="btn-gradient">Regisztráció</button>
                    </div>
                    <p class="text-center mt-3 mb-0" style="color: #64748b;">Már van fiókod? <a href="#login" class="fw-bold" style="color: #16a34a; text-decoration: none;">Lépj be itt!</a></p>
                </div>
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

    // Főoldal megjelenítése
    renderHome: async () => {
        UI.appContainer.innerHTML = `
            <div class="container mt-4">
                <h3 class="mb-4 fw-bold" style="color: #1e293b;">Legfrissebb receptek</h3>
                <div class="row g-4" id="recipe-list"></div>
                <div class="text-center mt-4" id="loading"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Betöltés...</span></div></div>
                <div class="text-center mt-4 d-none" id="no-recipes"><p class="text-muted">Még nincsenek receptek. Legyen Ön az első, aki hozzáad egyet!</p><a href="#add-recipe" class="btn btn-green">Új recept hozzáadása</a></div>
            </div>
        `;

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

    // Csak a bejelentkezett felhasználó saját receptjei
    renderMyRecipes: async () => {
        const user = Auth.getUser();
        if (!user) {
            window.location.hash = '#login';
            return;
        }

        UI.appContainer.innerHTML = `
            <div class="container mt-4 mb-3">
                <div class="top-nav-card py-3 px-4 mx-auto" style="max-width: 900px; margin-top: 0;">
                    <a class="fw-bold text-decoration-none" href="#home" style="color: #334155; font-size: 1.1rem;">⬅ Vissza a főoldalra</a>
                </div>
            </div>
            <div class="container mt-4">
                <h3 class="mb-4 fw-bold" style="color: #1e293b;">Saját receptjeim</h3>
                <div class="row g-4" id="my-recipe-list"></div>
                <div class="text-center mt-4" id="my-loading"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Betöltés...</span></div></div>
                <div class="text-center mt-4 d-none" id="my-no-recipes">
                    <p class="text-muted">Még nincs saját recepted.</p>
                    <a href="#add-recipe" class="btn btn-green">Új recept hozzáadása</a>
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

        // --- OKOS KÉPVÁLASZTÓ KATEGÓRIA ALAPJÁN ---
        let placeholderImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Alap (Főétel)
        if (recipe.type === "Desszert" || recipe.type === "Desszertek") {
            placeholderImg = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Desszert kép
        } else if (recipe.type === "Előétel" || recipe.type === "Levesek") {
            placeholderImg = 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Előétel/Leves kép
        }

        const img = recipe.image || placeholderImg;
        const title = recipe.title || 'Ismeretlen recept';
        const desc = recipe.description || 'Leírás nem elérhető.';
        
        let badgeHtml = `<span class="badge bg-secondary mb-3 d-inline-block px-3 py-1">${recipe.type || 'Recept'}</span>`;
        if(recipe.type === "Főétel" || recipe.type === "Főételek") badgeHtml = `<span class="badge-foetel mb-3 d-inline-block">Főétel</span>`;
        if(recipe.type === "Desszert" || recipe.type === "Desszertek") badgeHtml = `<span class="badge-desszert mb-3 d-inline-block">Desszert</span>`;
        if(recipe.type === "Levesek" || recipe.type === "Előétel") badgeHtml = `<span class="badge bg-success mb-3 d-inline-block px-3 py-1">${recipe.type}</span>`;

        return `
            <div class="col-md-4">
                <div class="recipe-card">
                    <img src="${img}" alt="${title}">
                    <div class="card-body p-4 d-flex flex-column">
                        ${badgeHtml}
                        <h4 class="card-title fw-bold" style="color: #1e293b;">${title}</h4>
                        <p class="card-text mt-2 text-truncate" style="color: #64748b; max-height: 4.8em;">${desc}</p>
                        <a href="#recipe/${id}" class="btn-gradient mt-auto w-100 text-center text-decoration-none">Megnézem</a>
                    </div>
                </div>
            </div>
        `;
    },

    // Új recept oldal
    renderAddRecipe: () => {
        const user = Auth.getUser();
        if (!user) {
            UI.appContainer.innerHTML = `
                <div class="container d-flex justify-content-center align-items-center mt-4">
                    <div class="app-card text-center" style="max-width: 500px;">
                        <p class="fs-5 text-muted mb-4">Be kell jelentkezned ahhoz, hogy receptet adhass hozzá.</p>
                        <a href="#login" class="btn-gradient w-100 text-decoration-none d-block">Bejelentkezés</a>
                    </div>
                </div>
            `;
            return;
        }

        UI.appContainer.innerHTML = `
            <div class="container mt-4 mb-3">
                <div class="top-nav-card py-3 px-4 mx-auto" style="max-width: 700px; margin-top: 0;">
                    <a class="fw-bold text-decoration-none" href="#home" style="color: #334155; font-size: 1.1rem;">⬅ Vissza a főoldalra</a>
                </div>
            </div>

            <div class="container mb-5">
                <div class="app-card mx-auto" style="max-width: 700px; padding: 40px;">
                    <h2 class="mb-4 fw-bold text-center" style="color: #1e293b;">✍️ Új Recept Felvitele</h2>
                    
                    <form id="add-recipe-form">
                        <div class="mb-4">
                            <label for="recipe-title" class="form-label fw-bold" style="color: #1e293b; font-size: 0.95rem;">Recept neve</label>
                            <input type="text" class="form-control" id="recipe-title" placeholder="Pl.: Nagyi húslevese" required>
                        </div>

                        <div class="mb-4">
                            <label for="recipe-category" class="form-label fw-bold" style="color: #1e293b; font-size: 0.95rem;">Kategória</label>
                            <select class="form-control" id="recipe-category" style="appearance: auto;">
                                <option value="1">Előétel</option>
                                <option value="2">Főétel</option>
                                <option value="3">Desszert</option>
                            </select>
                        </div>
                        
                        <div class="mb-5">
                            <label for="recipe-description" class="form-label fw-bold" style="color: #1e293b; font-size: 0.95rem;">Elkészítés leírása</label>
                            <textarea class="form-control" id="recipe-description" rows="6" placeholder="Kezdd azzal, hogy megpucolod a hagymát..."></textarea>
                        </div>
                        
                        <div class="d-grid gap-2 mt-2">
                            <button type="submit" class="btn-gradient py-3">MENTÉS AZ ADATBÁZISBA</button>
                        </div>
                    </form>
                </div>
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
            <div class="container mt-4 mb-3">
                <div class="top-nav-card py-3 px-4 mx-auto" style="max-width: 800px; margin-top: 0;">
                    <a class="fw-bold text-decoration-none" href="#home" style="color: #334155; font-size: 1.1rem;">⬅ Vissza a listához</a>
                </div>
            </div>
            <div class="container mb-5" id="recipe-content">
                <div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>
            </div>
        `;

        const data = await Api.call(API_ACTIONS.GET_RECIPE_DETAILS, { id });
        const container = document.getElementById('recipe-content');

        if (data.error) {
            container.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
            return;
        }

        if (!data || !data.title) {
            container.innerHTML = '<div class="alert alert-warning text-center mx-auto" style="max-width: 800px;">Recept nem található.</div>';
            return;
        }

        const categoryName = data.category || 'Recept';

        // --- OKOS KÉPVÁLASZTÓ A RÉSZLETEK OLDALRA IS ---
        let placeholderImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'; // Alap (Főétel)
        if (categoryName === "Desszert" || categoryName === "Desszertek") {
            placeholderImg = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'; // Desszert
        } else if (categoryName === "Előétel" || categoryName === "Levesek") {
            placeholderImg = 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'; // Előétel
        }

        const imgUrl = data.image || placeholderImg;
        
        let badgeHtml = `<span class="badge bg-secondary mb-3 px-3 py-2">${categoryName}</span>`;
        if(categoryName === "Főétel" || categoryName === "Főételek") badgeHtml = `<span class="badge-foetel mb-3 d-inline-block px-3 py-2">Főétel</span>`;
        if(categoryName === "Desszert" || categoryName === "Desszertek") badgeHtml = `<span class="badge-desszert mb-3 d-inline-block px-3 py-2">Desszert</span>`;
        if(categoryName === "Levesek" || categoryName === "Előétel") badgeHtml = `<span class="badge bg-success mb-3 d-inline-block px-3 py-2">${categoryName}</span>`;

        container.innerHTML = `
            <div class="app-card mx-auto p-0 overflow-hidden text-start" style="max-width: 800px;">
                <img src="${imgUrl}" alt="${data.title}" class="w-100" style="height: 400px; object-fit: cover;">
                
                <div class="p-5">
                    ${badgeHtml}
                    <h1 class="fw-bold mb-3" style="color: #1e293b; font-size: 2.5rem;">${data.title}</h1>
                    <p class="text-muted mb-5" style="font-size: 0.95rem;"><strong>Feltöltötte:</strong> ${data.author || 'Ismeretlen'}</p>
                    
                    <hr style="border-color: #e2e8f0; margin-bottom: 2rem;">
                    
                    <h4 class="fw-bold mt-4 mb-4" style="color: #b91c1c;">Elkészítés lépései</h4>
                    <p style="line-height: 1.8; font-size: 1.05rem; color: #475569; white-space: pre-wrap;">${data.description || 'Nincs leírás megadva.'}</p>
                </div>
            </div>
        `;
    }
};