const Router = {
    routes: {
        home: UI.renderHome, login: UI.renderLogin, register: UI.renderRegister,
        'add-recipe': UI.renderAddRecipe, 'my-recipes': UI.renderMyRecipes,
    },
    init: () => { window.addEventListener('hashchange', Router.handleRoute); window.addEventListener('load', Router.handleRoute); Auth.updateNavbar(); },
    parseHash: (hash) => {
        if (!hash || hash === '#') return 'home';
        if (hash.startsWith('#recipe/')) return 'recipe';
        if (hash.startsWith('#edit-recipe/')) return 'edit-recipe';
        return hash.slice(1);
    },
    handleRoute: async () => {
        const hash = window.location.hash; const route = Router.parseHash(hash); const isLoggedIn = Auth.isLoggedIn();
        if (!isLoggedIn && !['home', 'login', 'register', 'recipe'].includes(route)) { window.location.hash = '#login'; return; }
        if (isLoggedIn && ['login', 'register'].includes(route)) { window.location.hash = '#home'; return; }
        
        if (route === 'recipe') { await UI.renderRecipeDetails(hash.split('/')[1]); return; }
        if (route === 'edit-recipe') { await UI.renderEditRecipe(hash.split('/')[1]); return; }
        
        const view = Router.routes[route];
        if (view) { await view(); return; }
        UI.appContainer.innerHTML = `<div class="container text-center py-5"><h2>404 - Nincs ilyen oldal</h2></div>`;
    },
};
Router.init();