// UI modul: a felhasználói felület nézeteit készíti el és helyezi be az #app konténerbe.
const UI = {
    appContainer: document.getElementById('app'),

    // --- 1. BEJELENTKEZÉS ---
    renderLogin: async () => {
        UI.appContainer.innerHTML = `
            <div class="container d-flex justify-content-center align-items-center mt-4 fade-in-up">
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

    // --- 2. REGISZTRÁCIÓ ---
    renderRegister: async () => {
        UI.appContainer.innerHTML = `
            <div class="container d-flex justify-content-center align-items-center mt-4 fade-in-up">
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

            if (!username || !password) {
                alert('A felhasználónév és jelszó kötelező.');
                return;
            }

            if (password.length < 6) {
                alert('A jelszónak legalább 6 karakter hosszúnak kell lennie.');
                return;
            }

            if (password !== confirm) {
                alert('A jelszavak nem egyeznek.');
                return;
            }

            if (email) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    alert('Kérlek, egy érvényes e-mail címet adj meg (pl. minta@email.hu)!');
                    return;
                }
            }

            Auth.register(username, password, email);
        });
    },

    // --- 3. FŐOLDAL ---
    renderHome: async () => {
        let catOptions = `
            <option value="all">Összes kategória</option>
            <option value="1">Levesek</option>
            <option value="2">Főételek</option>
            <option value="3">Desszertek</option>
            <option value="4">Saláták</option>
            <option value="5">Reggelik</option>
        `;

        UI.appContainer.innerHTML = `
            <div class="container mt-4 fade-in-up">
                <div class="app-card mb-4 p-4">
                    <div class="row g-3 align-items-end">
                        <div class="col-md-6">
                            <label class="form-label fw-bold" style="color: #1e293b;">Keresés</label>
                            <input type="text" id="search-input" class="form-control" placeholder="Recept neve...">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold" style="color: #1e293b;">Kategória</label>
                            <select id="category-select" class="form-control" style="appearance: auto;">
                                ${catOptions}
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button id="filter-btn" class="btn-gradient w-100">Keresés</button>
                        </div>
                    </div>
                </div>
                
                <h3 class="mb-4 fw-bold" style="color: #1e293b;">Legfrissebb receptek</h3>
                
                <div class="row g-4 mb-4" id="loading">
                    <div class="col-md-6 col-lg-4"><div class="recipe-card skeleton"><div class="skeleton-img"></div><div class="skeleton-title skeleton"></div><div class="skeleton-text skeleton"></div><div class="skeleton-text skeleton"></div></div></div>
                    <div class="col-md-6 col-lg-4 d-none d-md-block"><div class="recipe-card skeleton"><div class="skeleton-img"></div><div class="skeleton-title skeleton"></div><div class="skeleton-text skeleton"></div><div class="skeleton-text skeleton"></div></div></div>
                    <div class="col-md-6 col-lg-4 d-none d-lg-block"><div class="recipe-card skeleton"><div class="skeleton-img"></div><div class="skeleton-title skeleton"></div><div class="skeleton-text skeleton"></div><div class="skeleton-text skeleton"></div></div></div>
                </div>

                <div class="row g-4" id="recipe-list"></div>
                <div class="text-center mt-4 d-none" id="no-recipes"><p class="text-muted">Nincs találat a megadott kritériumokra.</p><a href="#home" class="btn-gradient px-4 text-decoration-none" id="reset-filters">Szűrés törlése</a></div>
            </div>
        `;

        let currentSearch = '';
        let currentCategory = 'all';

        async function loadRecipes() {
            const listContainer = document.getElementById('recipe-list');
            const loading = document.getElementById('loading');
            const noRecipes = document.getElementById('no-recipes');

            if (loading) loading.classList.remove('d-none');
            if (noRecipes) noRecipes.classList.add('d-none');
            listContainer.innerHTML = '';

            try {
                let data;
                if (currentSearch || (currentCategory && currentCategory !== 'all')) {
                    data = await Api.call(API_ACTIONS.SEARCH_RECIPES, {
                        search: currentSearch,
                        category_id: currentCategory
                    });
                } else {
                    data = await Api.call(API_ACTIONS.GET_RECIPES);
                }

                if (loading) loading.classList.add('d-none');

                if (data.error) {
                    listContainer.innerHTML = `<div class="alert alert-danger">Hiba: ${data.error}</div>`;
                    return;
                }

                if (!Array.isArray(data) || data.length === 0) {
                    if (noRecipes) noRecipes.classList.remove('d-none');
                    return;
                }

                data.forEach((recipe, index) => listContainer.insertAdjacentHTML('beforeend', UI.buildRecipeCard(recipe, index)));
            } catch (err) {
                console.error('Hiba a receptek betöltésénél:', err);
                if (loading) loading.classList.add('d-none');
                listContainer.innerHTML = '<div class="alert alert-danger">Hiba a betöltés során.</div>';
            }
        }

        document.getElementById('filter-btn')?.addEventListener('click', () => {
            currentSearch = document.getElementById('search-input').value.trim();
            currentCategory = document.getElementById('category-select').value;
            loadRecipes();
        });

        document.getElementById('search-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                currentSearch = e.target.value.trim();
                currentCategory = document.getElementById('category-select').value;
                loadRecipes();
            }
        });

        document.getElementById('reset-filters')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('search-input').value = '';
            document.getElementById('category-select').value = 'all';
            currentSearch = '';
            currentCategory = 'all';
            loadRecipes();
        });

        loadRecipes();
    },

    // --- 4. SAJÁT RECEPTEK ---
    renderMyRecipes: async () => {
        const user = Auth.getUser();
        if (!user) {
            window.location.hash = '#login';
            return;
        }

        let catOptions = `
            <option value="all">Összes kategória</option>
            <option value="1">Levesek</option>
            <option value="2">Főételek</option>
            <option value="3">Desszertek</option>
            <option value="4">Saláták</option>
            <option value="5">Reggelik</option>
        `;

        UI.appContainer.innerHTML = `
            <div class="container mt-4 mb-3 fade-in-up">
                <div class="top-nav-card py-3 px-4 mx-auto" style="max-width: 900px; margin-top: 0;">
                    <a class="fw-bold text-decoration-none" href="#home" style="color: #334155; font-size: 1.1rem;">⬅ Vissza a főoldalra</a>
                </div>
            </div>

            <div class="container mt-2 mb-4 fade-in-up" style="animation-delay: 0.1s;">
                <div class="app-card mb-4 p-4">
                    <div class="row g-3 align-items-end">
                        <div class="col-md-6">
                            <label class="form-label fw-bold" style="color: #1e293b;">Keresés</label>
                            <input type="text" id="my-search-input" class="form-control" placeholder="Recept neve...">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold" style="color: #1e293b;">Kategória</label>
                            <select id="my-category-select" class="form-control" style="appearance: auto;">
                                ${catOptions}
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button id="my-filter-btn" class="btn-gradient w-100">Keresés</button>
                        </div>
                    </div>
                </div>

                <h3 class="mb-4 fw-bold" style="color: #1e293b;">Saját receptjeim</h3>
                
                <div class="row g-4 mb-4" id="my-loading">
                    <div class="col-md-6 col-lg-4"><div class="recipe-card skeleton"><div class="skeleton-img"></div><div class="skeleton-title skeleton"></div><div class="skeleton-text skeleton"></div><div class="skeleton-text skeleton"></div></div></div>
                    <div class="col-md-6 col-lg-4 d-none d-md-block"><div class="recipe-card skeleton"><div class="skeleton-img"></div><div class="skeleton-title skeleton"></div><div class="skeleton-text skeleton"></div><div class="skeleton-text skeleton"></div></div></div>
                    <div class="col-md-6 col-lg-4 d-none d-lg-block"><div class="recipe-card skeleton"><div class="skeleton-img"></div><div class="skeleton-title skeleton"></div><div class="skeleton-text skeleton"></div><div class="skeleton-text skeleton"></div></div></div>
                </div>

                <div class="row g-4" id="my-recipe-list"></div>
                
                <div class="text-center mt-4 d-none" id="my-no-recipes">
                    <p class="text-muted">Nincs találat a megadott kritériumokra.</p>
                    <a href="#add-recipe" class="btn-gradient px-4 text-decoration-none">Új recept hozzáadása</a>
                </div>
            </div>
        `;

        let currentSearch = '';
        let currentCategory = 'all';

        async function loadMyRecipes() {
            const listContainer = document.getElementById('my-recipe-list');
            const loading = document.getElementById('my-loading');
            const noRecipes = document.getElementById('my-no-recipes');

            if (loading) loading.classList.remove('d-none');
            if (noRecipes) noRecipes.classList.add('d-none');
            listContainer.innerHTML = '';

            try {
                let data;
                if (currentSearch || (currentCategory && currentCategory !== 'all')) {
                    data = await Api.call(API_ACTIONS.SEARCH_RECIPES, {
                        search: currentSearch,
                        category_id: currentCategory,
                        user_id: user.id
                    });
                } else {
                    data = await Api.call(API_ACTIONS.GET_MY_RECIPES, { user_id: user.id });
                }

                if (loading) loading.classList.add('d-none');

                if (data.error) {
                    listContainer.innerHTML = `<div class="alert alert-danger">Hiba: ${data.error}</div>`;
                    return;
                }

                if (!Array.isArray(data) || data.length === 0) {
                    if (noRecipes) noRecipes.classList.remove('d-none');
                    return;
                }

                data.forEach((recipe, index) => listContainer.insertAdjacentHTML('beforeend', UI.buildRecipeCard(recipe, index, true)));
            } catch (err) {
                console.error('Hiba a receptek betöltésénél:', err);
                if (loading) loading.classList.add('d-none');
                listContainer.innerHTML = '<div class="alert alert-danger">Hiba a betöltés során.</div>';
            }
        }

        document.getElementById('my-filter-btn')?.addEventListener('click', () => {
            currentSearch = document.getElementById('my-search-input').value.trim();
            currentCategory = document.getElementById('my-category-select').value;
            loadMyRecipes();
        });

        document.getElementById('my-search-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                currentSearch = e.target.value.trim();
                currentCategory = document.getElementById('my-category-select').value;
                loadMyRecipes();
            }
        });

        loadMyRecipes();
    },

    // --- 5. KÁRTYA SABLON GENERÁLÓ ---
    buildRecipeCard: (recipe = {}, index = 0, isMyRecipe = false) => {
        const id = recipe.id ?? '0';
        let placeholderImg = 'uploads/husleves.webp';
        if (recipe.type === "Desszert" || recipe.type === "Desszertek") placeholderImg = 'uploads/palacsinta.jpg';
        else if (recipe.type === "Előétel" || recipe.type === "Levesek") placeholderImg = 'uploads/gulyasleves.webp';

        const img = recipe.image || placeholderImg;
        const title = recipe.title || 'Ismeretlen recept';
        const desc = recipe.description || 'Leírás nem elérhető.';

        let dotClass = 'bg-secondary';
        if (recipe.type === "Főétel" || recipe.type === "Főételek") dotClass = 'dot-foetel';
        if (recipe.type === "Desszert" || recipe.type === "Desszertek") dotClass = 'dot-desszert';
        if (recipe.type === "Levesek" || recipe.type === "Előétel") dotClass = 'dot-leves';

        const animationDelay = (index * 0.1) + 's';

        // Ha a saját receptünk, akkor Szerkesztés/Törlés gombok jönnek
        const buttonsHtml = isMyRecipe ? `
            <div class="d-flex gap-2 mt-auto">
                <button onclick="event.stopPropagation(); window.location.hash='#edit-recipe/${id}'" class="btn btn-warning flex-fill fw-bold text-white">Szerkesztés</button>
                <button onclick="event.stopPropagation(); UI.deleteRecipe(${id})" class="btn btn-danger flex-fill fw-bold">Törlés</button>
            </div>
        ` : `
            <a href="#recipe/${id}" class="btn-gradient mt-auto w-100 text-center text-decoration-none">Megnézem</a>
        `;

        return `
            <div class="col-md-6 col-lg-4 fade-in-up" style="animation-delay: ${animationDelay};">
                <div class="recipe-card" onclick="window.location.hash='#recipe/${id}'" style="cursor:pointer;">
                    <div class="recipe-image-wrapper" style="background-color: #e2e8f0; height: 220px; width: 100%; overflow: hidden;">
                        <img src="${img}" alt="${title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.opacity='0'">
                    </div>
                    <div class="card-body p-4 d-flex flex-column">
                        <div class="mb-3">
                            <span class="badge-modern"><span class="dot ${dotClass}"></span>${recipe.type || 'Recept'}</span>
                        </div>
                        <h4 class="card-title fw-bold mb-2" style="font-size: 1.25rem;">${title}</h4>
                        <p class="card-text text-muted mb-4" style="line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${desc}</p>
                        ${buttonsHtml}
                    </div>
                </div>
            </div>
        `;
    },

    // --- 6. ÚJ RECEPT FELVITELE ---
    renderAddRecipe: async () => {
        const user = Auth.getUser();
        if (!user) {
            UI.appContainer.innerHTML = `
                <div class="container d-flex justify-content-center align-items-center mt-4 fade-in-up">
                    <div class="app-card text-center" style="max-width: 500px;">
                        <p class="fs-5 text-muted mb-4">Be kell jelentkezned ahhoz, hogy receptet adhass hozzá.</p>
                        <a href="#login" class="btn-gradient w-100 text-decoration-none d-block">Bejelentkezés</a>
                    </div>
                </div>
            `;
            return;
        }

        UI.appContainer.innerHTML = `
            <div class="container mt-4 mb-3 fade-in-up">
                <div class="top-nav-card py-3 px-4 mx-auto" style="max-width: 700px; margin-top: 0;">
                    <a class="fw-bold text-decoration-none" href="#home" style="color: #334155; font-size: 1.1rem;">⬅ Vissza a főoldalra</a>
                </div>
            </div>

            <div class="container mb-5 fade-in-up" style="animation-delay: 0.1s;">
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
                                <option value="1">Levesek</option>
                                <option value="2">Főételek</option>
                                <option value="3">Desszertek</option>
                                <option value="4">Saláták</option>
                                <option value="5">Reggelik</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label for="recipe-image-file" class="form-label fw-bold" style="color: #1e293b; font-size: 0.95rem;">Kép (opcionális)</label>
                            <input type="file" class="form-control" id="recipe-image-file" accept="image/*">
                            <input type="hidden" id="recipe-image" value="">
                        </div>
                        
                        <div class="mb-5">
                            <label for="recipe-description" class="form-label fw-bold" style="color: #1e293b; font-size: 0.95rem;">Elkészítés rövid leírása</label>
                            <textarea class="form-control" id="recipe-description" rows="4" placeholder="Rövid kedvcsináló a receptről..."></textarea>
                        </div>

                        <hr class="my-4">
                        <h4 class="mb-3 fw-bold" style="color: #1e293b;">Hozzávalók</h4>
                        <div id="ingredients-list" class="mb-3"></div>
                        <button type="button" id="add-ingredient-btn" class="btn btn-outline-secondary btn-sm mb-4">+ Hozzávaló hozzáadása</button>

                        <hr class="my-4">
                        <h4 class="mb-3 fw-bold" style="color: #1e293b;">Lépések</h4>
                        <div id="steps-list" class="mb-3"></div>
                        <button type="button" id="add-step-btn" class="btn btn-outline-secondary btn-sm mb-4">+ Lépés hozzáadása</button>
                        
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

            let image = document.getElementById('recipe-image').value.trim();

            const fileInput = document.getElementById('recipe-image-file');
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                const formData = new FormData();
                formData.append('image', fileInput.files[0]);
                formData.append('action', 'upload_image');

                try {
                    const uploadResult = await fetch('api/api.php', {
                        method: 'POST',
                        body: formData
                    });
                    const uploadData = await uploadResult.json();
                    if (uploadData.success) {
                        image = uploadData.path;
                    } else {
                        alert('Hiba a kép feltöltésén: ' + (uploadData.error || 'Ismeretlen hiba'));
                        return;
                    }
                } catch (err) {
                    console.error('Kép feltöltési hiba:', err);
                    alert('Hiba a kép feltöltésén');
                    return;
                }
            }

            if (!title) {
                alert('A recept neve Kötelező!');
                return;
            }

            try {
                // RECEPT MENTÉSE
                const result = await Api.call(API_ACTIONS.ADD_RECIPE, {
                    user_id: user.id,
                    title,
                    description,
                    category_id: categoryId,
                    image: image
                });

                if (result.success) {
                    const recipeId = result.recipe_id;

                    const ingredientRows = document.querySelectorAll('.ingredient-row');

                    for (const row of ingredientRows) {
                        const selectEl = row.querySelector('.ingredient-select');
                        let ingredientId = selectEl.value;

                        const newRow = row.querySelector('.ingredient-new-row');
                        const newNameInput = row.querySelector('.ingredient-new-name');
                        const newName = newRow.classList.contains('d-none') ? '' : newNameInput.value.trim();

                        const quantity = row.querySelector('.ingredient-quantity').value;
                        let unit = row.querySelector('.ingredient-unit').value;

                        const unitNewRow = row.querySelector('.unit-new-row');
                        const newUnitNameInput = row.querySelector('.unit-new-name');
                        const newUnitAbbrInput = row.querySelector('.unit-new-abbr');
                        const newUnitName = unitNewRow.classList.contains('d-none') ? '' : newUnitNameInput.value.trim();
                        const newUnitAbbr = unitNewRow.classList.contains('d-none') ? '' : newUnitAbbrInput.value.trim();

                        if (unit === '__new__' && !unitNewRow.classList.contains('d-none') && newUnitName && newUnitAbbr) {
                            const unitResult = await Api.call(API_ACTIONS.ADD_UNIT, {
                                name: newUnitName,
                                abbreviation: newUnitAbbr
                            });
                            if (unitResult.success && unitResult.unit_id) {
                                unit = newUnitAbbr;
                            } else {
                                console.warn('Hiba az új mértékegység mentésekor, alapértelmezett: g');
                                unit = 'g';
                            }
                        }

                        if (ingredientId === '__new__' && !newRow.classList.contains('d-none')) {
                            if (!newName) {
                                continue;
                            }
                            if (!quantity) {
                                alert(`Kérlek adj meg mennyiséget ehhez: ${newName}!`);
                                continue;
                            }

                            const newResult = await Api.call(API_ACTIONS.ADD_INGREDIENT, { name: newName });

                            if (newResult.success && newResult.ingredient_id) {
                                ingredientId = newResult.ingredient_id;
                            } else {
                                alert(`Hiba a(z) "${newName}" mentésekor a szerveren: ` + (newResult.error || 'Ismeretlen hiba'));
                                continue;
                            }
                        }

                        if (ingredientId && ingredientId !== '__new__' && quantity) {
                            const linkResult = await Api.call(API_ACTIONS.ADD_RECIPE_INGREDIENT, {
                                recipe_id: recipeId,
                                ingredient_id: ingredientId,
                                quantity: quantity,
                                unit: unit
                            });

                            if (linkResult.error) {
                                alert(`Hiba a hozzávaló recepthez csatolásakor: ` + linkResult.error);
                            }
                        }
                    }

                    const stepRows = document.querySelectorAll('.step-row');
                    for (let i = 0; i < stepRows.length; i++) {
                        const desc = stepRows[i].querySelector('.step-description').value;
                        if (desc) {
                            await Api.call(API_ACTIONS.ADD_RECIPE_STEP, {
                                recipe_id: recipeId,
                                step_number: i + 1,
                                description: desc
                            });
                        }
                    }

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

        const ingredientsList = document.getElementById('ingredients-list');
        const stepsList = document.getElementById('steps-list');
        let ingredientCount = 0;
        let stepCount = 0;

        const allIngredients = await Api.call(API_ACTIONS.GET_ALL_INGREDIENTS);
        const ingArray = Array.isArray(allIngredients) ? allIngredients : [];

        const allUnits = await Api.call(API_ACTIONS.GET_ALL_UNITS);
        const unitArray = Array.isArray(allUnits) ? allUnits : [];

        window.handleIngredientSelect = function (select) {
            const row = select.closest('.ingredient-row');
            const newRow = row.querySelector('.ingredient-new-row');
            const newInput = row.querySelector('.ingredient-new-name');
            if (select.value === '__new__') {
                newRow.classList.remove('d-none');
                newInput.classList.remove('d-none');
                newInput.required = true;
            } else {
                newRow.classList.add('d-none');
                newInput.classList.add('d-none');
                newInput.required = false;
            }
        };

        window.handleUnitSelect = function (select) {
            const row = select.closest('.ingredient-row');
            const newRow = row.querySelector('.unit-new-row');
            const newInput = row.querySelector('.unit-new-name');
            const newAbbrInput = row.querySelector('.unit-new-abbr');
            if (select.value === '__new__') {
                newRow.classList.remove('d-none');
                newInput.classList.remove('d-none');
                newAbbrInput.classList.remove('d-none');
            } else {
                newRow.classList.add('d-none');
                newInput.classList.add('d-none');
                newAbbrInput.classList.add('d-none');
            }
        };

        function addIngredientRow() {
            ingredientCount++;
            const options = ingArray.map(i => `<option value="${i.id}">${i.name}</option>`).join('');
            const unitOptions = unitArray.map(u => `<option value="${u.abbreviation}">${u.abbreviation}</option>`).join('');

            ingredientsList.insertAdjacentHTML('beforeend', `
                <div class="ingredient-row fade-in-up mb-3">
                    <div class="d-flex gap-2 mb-2 align-items-center">
                        <select class="form-control ingredient-select" style="flex: 2;" onchange="handleIngredientSelect(this)">
                            <option value="">Válassz hozzávalót...</option>
                            ${options}
                            <option value="__new__">+ Új hozzávaló...</option>
                        </select>
                        <input type="number" class="form-control ingredient-quantity" placeholder="Mennyiség" style="width: 100px;">
                        <select class="form-control ingredient-unit" style="width: 90px;" onchange="handleUnitSelect(this)">
                            ${unitOptions}
                            <option value="__new__">+ Új...</option>
                        </select>
                        <button type="button" class="btn btn-outline-danger btn-sm remove-btn px-3">X</button>
                    </div>
                    <div class="ingredient-new-row d-none ps-3 border-start border-2 border-primary">
                        <input type="text" class="form-control ingredient-new-name mb-2" placeholder="Új hozzávaló neve">
                    </div>
                    <div class="unit-new-row d-none ps-3 border-start border-2 border-success">
                        <div class="d-flex gap-2">
                            <input type="text" class="form-control unit-new-name" placeholder="Mértékegység neve (pl: evőkanál)" style="flex: 2;">
                            <input type="text" class="form-control unit-new-abbr" placeholder="Rövidítés (pl: ek)" style="width: 80px;">
                        </div>
                    </div>
                </div>
            `);
            ingredientsList.querySelectorAll('.remove-btn').forEach(btn => {
                btn.onclick = () => btn.parentElement.parentElement.remove();
            });
        }

        function addStepRow() {
            stepCount++;
            stepsList.insertAdjacentHTML('beforeend', `
                <div class="step-row d-flex gap-2 mb-2 fade-in-up">
                    <span class="badge bg-secondary" style="align-self: center; font-size:1.1rem; padding: 10px 14px; border-radius:8px;">${stepCount}</span>
                    <textarea class="form-control step-description" placeholder="Ennek a lépésnek a leírása..." rows="2"></textarea>
                    <button type="button" class="btn btn-outline-danger btn-sm remove-btn px-3">X</button>
                </div>
            `);
            stepsList.querySelectorAll('.remove-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.target.parentElement.remove();
                    reindexSteps();
                };
            });
        }

        function reindexSteps() {
            const rows = stepsList.querySelectorAll('.step-row');
            rows.forEach((row, i) => {
                row.querySelector('.badge').textContent = i + 1;
            });
            stepCount = rows.length;
        }

        document.getElementById('add-ingredient-btn').onclick = addIngredientRow;
        document.getElementById('add-step-btn').onclick = addStepRow;

        addIngredientRow();
        addIngredientRow();
        addStepRow();
    },

    // --- 7. RECEPT RÉSZLETEI ---
    renderRecipeDetails: async (id) => {
        UI.appContainer.innerHTML = `
            <div class="container mt-4 mb-3 fade-in-up">
                <div class="top-nav-card py-3 px-4 mx-auto" style="max-width: 800px; margin-top: 0;">
                    <a class="fw-bold text-decoration-none" href="#home" style="color: #334155; font-size: 1.1rem;">⬅ Vissza a listához</a>
                </div>
            </div>
            <div class="container mb-5" id="recipe-content">
                <div class="app-card mx-auto p-0 overflow-hidden skeleton" style="max-width: 800px; height: 600px;"></div>
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

        let placeholderImg = 'uploads/husleves.webp';
        if (categoryName === "Desszert" || categoryName === "Desszertek") placeholderImg = 'uploads/palacsinta.jpg';
        else if (categoryName === "Előétel" || categoryName === "Levesek") placeholderImg = 'uploads/gulyasleves.webp';

        const imgUrl = data.image || placeholderImg;

        let dotClass = 'bg-secondary';
        if (categoryName === "Főétel" || categoryName === "Főételek") dotClass = 'dot-foetel';
        if (categoryName === "Desszert" || categoryName === "Desszertek") dotClass = 'dot-desszert';
        if (categoryName === "Levesek" || categoryName === "Előétel") dotClass = 'dot-leves';

        const badgeHtml = `<span class="badge-modern"><span class="dot ${dotClass}"></span>${categoryName}</span>`;

        const recipeIdNum = parseInt(id, 10);

        const ings = await Api.call('get_recipe_ingredients', { recipe_id: recipeIdNum });
        const ingsArray = Array.isArray(ings) ? ings : [];

        const steps = await Api.call('get_recipe_steps', { recipe_id: recipeIdNum });
        const stepsArray = Array.isArray(steps) ? steps : [];

        let ingredientsHtml = '';
        if (ingsArray.length > 0) {
            ingredientsHtml = '<table class="table table-hover mt-3"><thead><tr><th>Hozzávaló</th><th class="text-end">Mennyiség</th></tr></thead><tbody>';
            for (const ing of ingsArray) {
                ingredientsHtml += `<tr>
                    <td class="fw-bold" style="color: #475569;">${ing.ingredient_name || 'Ismeretlen'}</td>
                    <td class="text-end"><span class="badge bg-secondary px-3 py-2" style="font-size: 0.9rem;">${ing.quantity} ${ing.unit}</span></td>
                </tr>`;
            }
            ingredientsHtml += '</tbody></table>';
        } else {
            ingredientsHtml = '<p class="text-muted">Nincs hozzávaló megadva.</p>';
        }

        let stepsHtml = '';
        if (stepsArray.length > 0) {
            stepsHtml = '<div class="steps-list mt-4">';
            for (const step of stepsArray) {
                stepsHtml += `
                <div class="d-flex mb-4 p-3 rounded" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                    <div class="me-4 flex-shrink-0">
                        <div class="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle fw-bold" style="width: 40px; height: 40px; font-size: 1.2rem;">${step.step_number}</div>
                    </div>
                    <div class="pt-2" style="line-height: 1.7; color: #334155;">
                        ${step.description}
                    </div>
                </div>`;
            }
            stepsHtml += '</div>';
        } else {
            stepsHtml = '<p class="text-muted">Nincs lépés megadva.</p>';
        }

        const createdAt = data.created_at ? new Date(data.created_at).toLocaleDateString('hu-HU') : 'Nincs megadva';

        container.innerHTML = `
            <div class="app-card mx-auto p-0 overflow-hidden text-start fade-in-up" style="max-width: 800px;">
                <div style="background-color: #e2e8f0;">
                    <img src="${imgUrl}" alt="${data.title}" class="w-100" style="height: 450px; object-fit: cover;" onerror="this.style.opacity='0'">
                </div>
                
                <div class="p-5">
                    <div class="mb-3">${badgeHtml}</div>
                    <h1 class="fw-bold mb-3" style="color: #0f172a; font-size: 2.8rem; letter-spacing: -1px;">${data.title}</h1>
                    <p class="text-muted mb-4 pb-3 border-bottom" style="font-size: 1rem;">
                        <span class="me-3">👨‍🍳 <strong>Feltöltötte:</strong> ${data.author || 'Ismeretlen'}</span>
                        <span>📅 <strong>Létrehozva:</strong> ${createdAt}</span>
                    </p>

                    ${data.description ? `
                    <p class="mb-5 text-muted" style="line-height: 1.8; font-size: 1.1rem; border-left: 4px solid var(--accent); padding-left: 15px;">${data.description}</p>
                    ` : ''}
                    
                    <h3 class="fw-bold mt-5 mb-4" style="color: #0f172a;">🛒 Hozzávalók</h3>
                    ${ingredientsHtml}
                    
                    <h3 class="fw-bold mt-5 mb-4" style="color: #0f172a;">📝 Elkészítés lépései</h3>
                    ${stepsHtml}
                </div>
            </div>
        `;
    },

    // --- 8. RECEPT TÖRLÉSE ---
    deleteRecipe: async (id) => {
        if (!confirm('Biztosan törölni szeretnéd ezt a receptet? Ez a művelet nem vonható vissza!')) return;
        const user = Auth.getUser();
        const res = await Api.call(API_ACTIONS.DELETE_RECIPE, { recipe_id: id, user_id: user.id });
        if (res.success) {
            alert('Recept sikeresen törölve!');
            const hash = window.location.hash; window.location.hash = ''; setTimeout(() => window.location.hash = hash, 10);
        } else { alert('Hiba a törlés során: ' + res.error); }
    },

    // --- 9. RECEPT SZERKESZTÉSE ---
    renderEditRecipe: async (id) => {
        const user = Auth.getUser();
        if (!user) { window.location.hash = '#login'; return; }

        // Adatok betöltése
        const data = await Api.call(API_ACTIONS.GET_RECIPE_DETAILS, { id });
        if (data.error || data.user_id != user.id) {
            UI.appContainer.innerHTML = `<div class="container mt-5"><div class="alert alert-danger">Nincs jogosultságod, vagy a recept nem található!</div></div>`;
            return;
        }

        const recipeIdNum = parseInt(id, 10);
        const ings = await Api.call('get_recipe_ingredients', { recipe_id: recipeIdNum });
        const steps = await Api.call('get_recipe_steps', { recipe_id: recipeIdNum });

        UI.appContainer.innerHTML = `
            <div class="container mt-4 mb-3 fade-in-up">
                <div class="top-nav-card py-3 px-4 mx-auto" style="max-width: 700px; margin-top: 0;">
                    <a class="fw-bold text-decoration-none" href="#my-recipes" style="color: #334155; font-size: 1.1rem;">⬅ Vissza a saját receptekhez</a>
                </div>
            </div>

            <div class="container mb-5 fade-in-up" style="animation-delay: 0.1s;">
                <div class="app-card mx-auto" style="max-width: 700px; padding: 40px;">
                    <h2 class="mb-4 fw-bold text-center" style="color: #1e293b;">✏️ Recept Módosítása</h2>
                    
                    <form id="edit-recipe-form">
                        <div class="mb-4">
                            <label class="form-label fw-bold">Recept neve</label>
                            <input type="text" class="form-control" id="recipe-title" value="${data.title}" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label fw-bold">Kategória</label>
                            <select class="form-control" id="recipe-category">
                                <option value="1" ${data.category_id == 1 ? 'selected' : ''}>Levesek</option>
                                <option value="2" ${data.category_id == 2 ? 'selected' : ''}>Főételek</option>
                                <option value="3" ${data.category_id == 3 ? 'selected' : ''}>Desszertek</option>
                                <option value="4" ${data.category_id == 4 ? 'selected' : ''}>Saláták</option>
                                <option value="5" ${data.category_id == 5 ? 'selected' : ''}>Reggelik</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="form-label fw-bold">Kép módosítása (hagyd üresen, ha marad a régi)</label>
                            <input type="file" class="form-control" id="recipe-image-file" accept="image/*">
                            <input type="hidden" id="recipe-image" value="${data.image || ''}">
                        </div>
                        <div class="mb-5">
                            <label class="form-label fw-bold">Elkészítés rövid leírása</label>
                            <textarea class="form-control" id="recipe-description" rows="4">${data.description || ''}</textarea>
                        </div>
                        <hr class="my-4">
                        <h4 class="mb-3 fw-bold">Hozzávalók</h4>
                        <div id="ingredients-list" class="mb-3"></div>
                        <button type="button" id="add-ingredient-btn" class="btn btn-outline-secondary btn-sm mb-4">+ Hozzávaló hozzáadása</button>

                        <hr class="my-4">
                        <h4 class="mb-3 fw-bold">Lépések</h4>
                        <div id="steps-list" class="mb-3"></div>
                        <button type="button" id="add-step-btn" class="btn btn-outline-secondary btn-sm mb-4">+ Lépés hozzáadása</button>
                        
                        <div class="d-grid gap-2 mt-2">
                            <button type="submit" class="btn-warning btn py-3 fw-bold text-white fs-5">MÓDOSÍTÁSOK MENTÉSE</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('edit-recipe-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('recipe-title').value.trim();
            const description = document.getElementById('recipe-description').value.trim();
            const categoryId = document.getElementById('recipe-category').value;
            let image = document.getElementById('recipe-image').value.trim();
            
            const fileInput = document.getElementById('recipe-image-file');
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                const formData = new FormData(); formData.append('image', fileInput.files[0]); formData.append('action', 'upload_image');
                try {
                    const uploadResult = await fetch('api/api.php', { method: 'POST', body: formData });
                    const uploadData = await uploadResult.json();
                    if (uploadData.success) image = uploadData.path; else { alert('Hiba a kép feltöltésén'); return; }
                } catch (err) { alert('Hiba a kép feltöltésén'); return; }
            }

            if (!title) { alert('A recept neve Kötelező!'); return; }

            try {
                // 1. Alapadatok frissítése
                const result = await Api.call(API_ACTIONS.UPDATE_RECIPE, { recipe_id: id, user_id: user.id, title, description, category_id: categoryId, image });

                if (result.success) {
                    // 2. Töröljük a régi hozzávalókat és lépéseket
                    await Api.call(API_ACTIONS.CLEAR_RECIPE_DETAILS, { recipe_id: id });

                    // 3. Végigmegyünk a listákon és újra felvisszük
                    const ingredientRows = document.querySelectorAll('.ingredient-row');
                    for (const row of ingredientRows) {
                        const selectEl = row.querySelector('.ingredient-select');
                        let ingredientId = selectEl.value;
                        const newRow = row.querySelector('.ingredient-new-row');
                        const newNameInput = row.querySelector('.ingredient-new-name');
                        const newName = newRow.classList.contains('d-none') ? '' : newNameInput.value.trim();
                        const quantity = row.querySelector('.ingredient-quantity').value;
                        let unit = row.querySelector('.ingredient-unit').value;
                        const unitNewRow = row.querySelector('.unit-new-row');
                        const newUnitNameInput = row.querySelector('.unit-new-name');
                        const newUnitAbbrInput = row.querySelector('.unit-new-abbr');
                        const newUnitName = unitNewRow.classList.contains('d-none') ? '' : newUnitNameInput.value.trim();
                        const newUnitAbbr = unitNewRow.classList.contains('d-none') ? '' : newUnitAbbrInput.value.trim();

                        if (unit === '__new__' && !unitNewRow.classList.contains('d-none') && newUnitName && newUnitAbbr) {
                            const unitResult = await Api.call(API_ACTIONS.ADD_UNIT, { name: newUnitName, abbreviation: newUnitAbbr });
                            if (unitResult.success) unit = newUnitAbbr; else unit = 'g';
                        }
                        if (ingredientId === '__new__' && !newRow.classList.contains('d-none')) {
                            if (!newName || !quantity) continue;
                            const newResult = await Api.call(API_ACTIONS.ADD_INGREDIENT, { name: newName });
                            if (newResult.success) ingredientId = newResult.ingredient_id; else continue;
                        }
                        if (ingredientId && ingredientId !== '__new__' && quantity) {
                            await Api.call(API_ACTIONS.ADD_RECIPE_INGREDIENT, { recipe_id: id, ingredient_id: ingredientId, quantity: quantity, unit: unit });
                        }
                    }

                    const stepRows = document.querySelectorAll('.step-row');
                    for (let i = 0; i < stepRows.length; i++) {
                        const desc = stepRows[i].querySelector('.step-description').value;
                        if (desc) await Api.call(API_ACTIONS.ADD_RECIPE_STEP, { recipe_id: id, step_number: i + 1, description: desc });
                    }
                    alert('Recept sikeresen módosítva!');
                    window.location.hash = '#my-recipes';
                } else { alert(result.error || 'Hiba a módosításkor'); }
            } catch (error) { alert('Szerverhiba történt'); }
        });

        // Hozzávalók/Lépések betöltése
        const ingredientsList = document.getElementById('ingredients-list');
        const stepsList = document.getElementById('steps-list');
        let ingredientCount = 0; let stepCount = 0;
        
        const allIngredients = await Api.call(API_ACTIONS.GET_ALL_INGREDIENTS);
        const ingArray = Array.isArray(allIngredients) ? allIngredients : [];
        const allUnits = await Api.call(API_ACTIONS.GET_ALL_UNITS);
        const unitArray = Array.isArray(allUnits) ? allUnits : [];

        function addIngredientRow(existingData = null) {
            ingredientCount++;
            const options = ingArray.map(i => `<option value="${i.id}" ${existingData && existingData.ingredient_id == i.id ? 'selected' : ''}>${i.name}</option>`).join('');
            const unitOptions = unitArray.map(u => `<option value="${u.abbreviation}" ${existingData && existingData.unit == u.abbreviation ? 'selected' : ''}>${u.abbreviation}</option>`).join('');
            const qty = existingData ? existingData.quantity : '';

            ingredientsList.insertAdjacentHTML('beforeend', `
                <div class="ingredient-row fade-in-up mb-3">
                    <div class="d-flex gap-2 mb-2 align-items-center">
                        <select class="form-control ingredient-select" style="flex: 2;" onchange="handleIngredientSelect(this)">
                            <option value="">Válassz hozzávalót...</option>
                            ${options}
                            <option value="__new__">+ Új hozzávaló...</option>
                        </select>
                        <input type="number" class="form-control ingredient-quantity" placeholder="Mennyiség" style="width: 100px;" value="${qty}">
                        <select class="form-control ingredient-unit" style="width: 90px;" onchange="handleUnitSelect(this)">
                            ${unitOptions}
                            <option value="__new__">+ Új...</option>
                        </select>
                        <button type="button" class="btn btn-outline-danger btn-sm remove-btn px-3">X</button>
                    </div>
                    <div class="ingredient-new-row d-none ps-3 border-start border-2 border-primary">
                        <input type="text" class="form-control ingredient-new-name mb-2" placeholder="Új hozzávaló neve">
                    </div>
                    <div class="unit-new-row d-none ps-3 border-start border-2 border-success">
                        <div class="d-flex gap-2">
                            <input type="text" class="form-control unit-new-name" placeholder="Mértékegység neve" style="flex: 2;">
                            <input type="text" class="form-control unit-new-abbr" placeholder="Rövidítés" style="width: 80px;">
                        </div>
                    </div>
                </div>
            `);
            ingredientsList.querySelectorAll('.remove-btn').forEach(btn => btn.onclick = () => btn.parentElement.parentElement.remove());
        }

        function addStepRow(existingDesc = '') {
            stepCount++;
            stepsList.insertAdjacentHTML('beforeend', `
                <div class="step-row d-flex gap-2 mb-2 fade-in-up">
                    <span class="badge bg-secondary" style="align-self: center; font-size:1.1rem; padding: 10px 14px; border-radius:8px;">${stepCount}</span>
                    <textarea class="form-control step-description" rows="2">${existingDesc}</textarea>
                    <button type="button" class="btn btn-outline-danger btn-sm remove-btn px-3">X</button>
                </div>
            `);
            stepsList.querySelectorAll('.remove-btn').forEach(btn => { btn.onclick = (e) => { e.target.parentElement.remove(); reindexSteps(); }; });
        }
        function reindexSteps() {
            const rows = stepsList.querySelectorAll('.step-row');
            rows.forEach((row, i) => { row.querySelector('.badge').textContent = i + 1; });
            stepCount = rows.length;
        }

        document.getElementById('add-ingredient-btn').onclick = () => addIngredientRow();
        document.getElementById('add-step-btn').onclick = () => addStepRow();

        // Meglévő adatok betöltése
        if (Array.isArray(ings) && ings.length > 0) ings.forEach(ing => addIngredientRow(ing));
        else { addIngredientRow(); addIngredientRow(); }

        if (Array.isArray(steps) && steps.length > 0) steps.forEach(step => addStepRow(step.description));
        else { addStepRow(); }
    }
};