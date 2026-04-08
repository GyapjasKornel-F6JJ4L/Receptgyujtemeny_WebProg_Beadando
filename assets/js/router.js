// A Router felelős a hash-alapú útválasztásért.
// Hash-routing: #home, #login, #register, #add-recipe, #recipe/:id
// Ez a modul figyeli a hash-changes és load eseményeket, majd a megfelelő UI.render* függvényeket hívja meg.
const Router = {
    // Egyszerű route térkép: path -> UI függvény
    routes: {
        home: UI.renderHome,
        login: UI.renderLogin,
        register: UI.renderRegister,
        'add-recipe': UI.renderAddRecipe,
        'my-recipes': UI.renderMyRecipes,
    },

    // init(): elindítja a hashfigyelést és egyszerre frissíti a navbar státuszt.
    init: () => {
        window.addEventListener('hashchange', Router.handleRoute);
        window.addEventListener('load', Router.handleRoute);
        Auth.updateNavbar();
    },

    // hash értelmezése egyszerű útvonalnévként (paraméterek nélkül)
    parseHash: (hash) => {
        if (!hash || hash === '#') return 'home';

        // #recipe/12 jelzésével külön kezeljük a detaily route-ot
        if (hash.startsWith('#recipe/')) return 'recipe';

        return hash.slice(1);
    },

    // Fő útvonalkezelő: ellenőrzi bejelentkezési állapotot és kiadja a nézetnek a renderelést.
    handleRoute: async () => {
        const hash = window.location.hash;
        const route = Router.parseHash(hash);
        const isLoggedIn = Auth.isLoggedIn();

        // Vendég: receptlista, részletek, login/register; egyéb (pl. saját receptek) → bejelentkezés
        if (!isLoggedIn && !['home', 'login', 'register', 'recipe'].includes(route)) {
            window.location.hash = '#login';
            return;
        }

        if (isLoggedIn && ['login', 'register'].includes(route)) {
            window.location.hash = '#home';
            return;
        }

        // #recipe/:id esetében dinamikus ID-vel hívjuk a detail nézetet.
        if (route === 'recipe') {
            const recipeId = hash.split('/')[1];
            await UI.renderRecipeDetails(recipeId);
            return;
        }

        // Ha route megtalálható a routes mapben, renderelni kell.
        const view = Router.routes[route];
        if (view) {
            await view();
            return;
        }

        UI.appContainer.innerHTML = `
            <div class="container text-center py-5">
                <h2>404 - Az oldal nem található</h2>
                <a href="#home" class="btn btn-primary mt-3">Vissza a főoldalra</a>
            </div>
        `;
    },
};

Router.init();