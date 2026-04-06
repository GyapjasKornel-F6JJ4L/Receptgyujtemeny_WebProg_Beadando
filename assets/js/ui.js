// UI modul: a felhasználói felület nézeteit készíti el és helyezi be az #app konténerbe.
// Ez a modul mutatja a főoldalt, bejelentkezési és regisztrációs űrlapokat,
// és futtatja a backend hívásokat a receptek lekéréséhez.
const UI = {
    appContainer: document.getElementById('app'),

    // Bejelentkező nézet kirajzolása
    renderLogin: async () => {
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
    renderRegister: async () => {
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
        let placeholderImg = 'uploads/husleves.jpg';
        if (recipe.type === "Desszert" || recipe.type === "Desszertek") {
            placeholderImg = 'uploads/palacsinta.jpg';
        } else if (recipe.type === "Előétel" || recipe.type === "Levesek") {
            placeholderImg = 'uploads/lecsos.jpg';
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
    renderAddRecipe: async () => {
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
                            <label for="recipe-category" class="form-label fw-bold" style="color: #1e293b; font-size: 0.95rem;">Kategoria</label>
                            <select class="form-control" id="recipe-category" style="appearance: auto;">
                                <option value="1">Levesek</option>
                                <option value="2">Foetelek</option>
                                <option value="3">Desszertek</option>
                                <option value="4">Salatak</option>
                                <option value="5">Reggelik</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label for="recipe-image-file" class="form-label fw-bold" style="color: #1e293b; font-size: 0.95rem;">Kép (opcionális)</label>
                            <input type="file" class="form-control" id="recipe-image-file" accept="image/*">
                            <input type="hidden" id="recipe-image" value="">
                        </div>
                        
                        <div class="mb-5">
                            <label for="recipe-description" class="form-label fw-bold" style="color: #1e293b; font-size: 0.95rem;">Elkeszites leirasa</label>
                            <textarea class="form-control" id="recipe-description" rows="4" placeholder="Rovid leiras a receptrol..."></textarea>
                        </div>

                        <hr class="my-4">
                        <h4 class="mb-3 fw-bold" style="color: #1e293b;">Hozzavalok</h4>
                        <div id="ingredients-list" class="mb-3"></div>
                        <button type="button" id="add-ingredient-btn" class="btn btn-outline-secondary btn-sm mb-4">+ Hozzavaló hozzáadása</button>

                        <hr class="my-4">
                        <h4 class="mb-3 fw-bold" style="color: #1e293b;">Lepesek</h4>
                        <div id="steps-list" class="mb-3"></div>
                        <button type="button" id="add-step-btn" class="btn btn-outline-secondary btn-sm mb-4">+ Lépés hozzáadása</button>
                        
                        <div class="d-grid gap-2 mt-2">
                            <button type="submit" class="btn-gradient py-3">MENTES AZ ADATBAZISBA</button>
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
                alert('A recept neve Kotelezo!');
                return;
            }

            try {
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
                    let newIngCache = ingArray;
                    
                    for (const row of ingredientRows) {
                        const selectEl = row.querySelector('.ingredient-select');
                        let ingredientId = selectEl.value;
                        const newNameInput = row.querySelector('.ingredient-new-name');
                        const newName = newNameInput.value.trim();
                        const quantity = row.querySelector('.ingredient-quantity').value;
                        const unit = row.querySelector('.ingredient-unit').value;
                        
                        if (newName && quantity && !ingredientId) {
                            const newResult = await Api.call(API_ACTIONS.ADD_INGREDIENT, { name: newName });
                            if (newResult.success) {
                                const all = await Api.call(API_ACTIONS.GET_ALL_INGREDIENTS);
                                newIngCache = Array.isArray(all) ? all : [];
                                const found = newIngCache.find(i => i.name.toLowerCase() === newName.toLowerCase());
                                ingredientId = found ? found.id : newResult.ingredient_id;
                            }
                        }
                        
                        if (ingredientId && quantity) {
                            await Api.call(API_ACTIONS.ADD_RECIPE_INGREDIENT, {
                                recipe_id: recipeId,
                                ingredient_id: ingredientId,
                                quantity: quantity,
                                unit: unit
                            });
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

                    alert('Recept sikeresen hozzaadva!');
                    window.location.hash = '#home';
                } else {
                    alert(result.error || 'Hiba a recept hozzaadasakor');
                }
            } catch (error) {
                console.error('Hiba:', error);
                alert('Szerverhiba tortent');
            }
        });

        const ingredientsList = document.getElementById('ingredients-list');
        const stepsList = document.getElementById('steps-list');
        let ingredientCount = 0;
        let stepCount = 0;

        const allIngredients = await Api.call(API_ACTIONS.GET_ALL_INGREDIENTS);
        const ingArray = Array.isArray(allIngredients) ? allIngredients : [];

        window.handleIngredientSelect = function(select) {
            const newInput = select.parentElement.querySelector('.ingredient-new-name');
            if (select.value === '__new__') {
                newInput.classList.remove('d-none');
                newInput.required = true;
            } else {
                newInput.classList.add('d-none');
                newInput.required = false;
            }
        };

        async function createNewIngredient(name) {
            const result = await Api.call(API_ACTIONS.ADD_INGREDIENT, { name: name });
            if (result.success) {
                const newIng = await Api.call(API_ACTIONS.GET_ALL_INGREDIENTS);
                return { array: Array.isArray(newIng) ? newIng : [], newId: result.ingredient_id };
            }
            return { array: ingArray, newId: null };
        }

        function addIngredientRow() {
            ingredientCount++;
            const options = ingArray.map(i => `<option value="${i.id}">${i.name}</option>`).join('');
            ingredientsList.insertAdjacentHTML('beforeend', `
                <div class="ingredient-row d-flex gap-2 mb-2 align-items-center">
                    <select class="form-control ingredient-select" style="flex: 2;" onchange="handleIngredientSelect(this)">
                        <option value="">Valassz hozzavalot...</option>
                        ${options}
                        <option value="__new__">+ Uj hozzavalo...</option>
                    </select>
                    <input type="text" class="form-control ingredient-new-name d-none" placeholder="Uj hozzavalo neve" style="flex: 2;">
                    <input type="number" class="form-control ingredient-quantity" placeholder="Mennyiseg" style="width: 80px;">
                    <select class="form-control ingredient-unit" style="width: 90px;">
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                        <option value="db">db</option>
                        <option value="ek">ek</option>
                        <option value="tk">tk</option>
                        <option value="csipet">csipet</option>
                        <option value="szem">szem</option>
                        <option value="szelet">szelet</option>
                        <option value="dl">dl</option>
                    </select>
                    <button type="button" class="btn btn-outline-danger btn-sm remove-btn">X</button>
                </div>
            `);
            ingredientsList.querySelectorAll('.remove-btn').forEach(btn => {
                btn.onclick = () => btn.parentElement.remove();
            });
        }

        function addStepRow() {
            stepCount++;
            stepsList.insertAdjacentHTML('beforeend', `
                <div class="step-row d-flex gap-2 mb-2">
                    <span class="badge bg-secondary" style="align-self: center;">${stepCount}</span>
                    <textarea class="form-control step-description" placeholder="Ennek a lepesnek a leirasa..." rows="2"></textarea>
                    <button type="button" class="btn btn-outline-danger btn-sm remove-btn">X</button>
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
        let placeholderImg = 'uploads/husleves.jpg';
        if (categoryName === "Desszert" || categoryName === "Desszertek") {
            placeholderImg = 'uploads/palacsinta.jpg';
        } else if (categoryName === "Előétel" || categoryName === "Levesek") {
            placeholderImg = 'uploads/lecsos.jpg';
        }

        const imgUrl = data.image || placeholderImg;
        
        let badgeHtml = `<span class="badge bg-secondary mb-3 px-3 py-2">${categoryName}</span>`;
        if(categoryName === "Főétel" || categoryName === "Főételek") badgeHtml = `<span class="badge-foetel mb-3 d-inline-block px-3 py-2">Főétel</span>`;
        if(categoryName === "Desszert" || categoryName === "Desszertek") badgeHtml = `<span class="badge-desszert mb-3 d-inline-block px-3 py-2">Desszert</span>`;
        if(categoryName === "Levesek" || categoryName === "Előétel") badgeHtml = `<span class="badge bg-success mb-3 d-inline-block px-3 py-2">${categoryName}</span>`;

        const recipeIdNum = parseInt(id, 10);
        
        const ings = await Api.call('get_recipe_ingredients', { recipe_id: recipeIdNum });
        const ingsArray = Array.isArray(ings) ? ings : [];
        
        const steps = await Api.call('get_recipe_steps', { recipe_id: recipeIdNum });
        const stepsArray = Array.isArray(steps) ? steps : [];

        let ingredientsHtml = '';
        if (ingsArray.length > 0) {
            ingredientsHtml = '<table class="table table-hover"><thead><tr><th>Hozzavaló</th><th class="text-end">Mennyiség</th></tr></thead><tbody>';
            for (const ing of ingsArray) {
                ingredientsHtml += `<tr>
                    <td>${ing.ingredient_name || 'Ismeretlen'}</td>
                    <td class="text-end"><span class="badge bg-primary">${ing.quantity} ${ing.unit}</span></td>
                </tr>`;
            }
            ingredientsHtml += '</tbody></table>';
        } else {
            ingredientsHtml = '<p class="text-muted">Nincs hozzavaló megadva.</p>';
        }

        let stepsHtml = '';
        if (stepsArray.length > 0) {
            stepsHtml = '<div class="steps-list">';
            for (const step of stepsArray) {
                stepsHtml += `
                <div class="accordion-item border-0 mb-2">
                    <h5 class="accordion-header">
                        <span class="badge bg-success me-2">${step.step_number}</span>${step.description}
                    </h5>
                </div>`;
            }
            stepsHtml += '</div>';
        } else {
            stepsHtml = '<p class="text-muted">Nincs lepes megadva.</p>';
        }

        const createdAt = data.created_at ? new Date(data.created_at).toLocaleDateString('hu-HU') : 'Nincs megadva';
        const firstMade = data.first_made ? new Date(data.first_made).toLocaleDateString('hu-HU') : 'Nincs megadva';

        container.innerHTML = `
            <div class="app-card mx-auto p-0 overflow-hidden text-start" style="max-width: 800px;">
                <img src="${imgUrl}" alt="${data.title}" class="w-100" style="height: 400px; object-fit: cover;">
                
                <div class="p-5">
                    ${badgeHtml}
                    <h1 class="fw-bold mb-2" style="color: #1e293b; font-size: 2.5rem;">${data.title}</h1>
                    <p class="text-muted mb-4" style="font-size: 0.95rem;">
                        <strong>Feltöltötte:</strong> ${data.author || 'Ismeretlen'} | 
                        <strong>Létrehozva:</strong> ${createdAt} | 
                        <strong>Elkészítve:</strong> ${firstMade}
                    </p>

                    <hr style="border-color: #e2e8f0; margin-bottom: 2rem;">

                    ${data.description ? `
                    <h4 class="fw-bold mt-4 mb-3" style="color: #b91c1c;">Rovid leiras</h4>
                    <p class="mb-4" style="line-height: 1.8;">${data.description}</p>
                    <hr style="border-color: #e2e8f0; margin-bottom: 2rem;">
                    ` : ''}
                    
                    <h4 class="fw-bold mt-4 mb-3" style="color: #b91c1c;">Hozzavalok</h4>
                    ${ingredientsHtml}
                    
                    <hr style="border-color: #e2e8f0; margin-bottom: 2rem;">
                    
                    <h4 class="fw-bold mt-4 mb-3" style="color: #b91c1c;">Elkeszites lepesei</h4>
                    ${stepsHtml}
                </div>
            </div>
        `;
    }
};