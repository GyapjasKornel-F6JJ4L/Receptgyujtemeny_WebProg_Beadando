const API_ENDPOINTS = { app: 'api/api.php', auth: 'api/auth.php' };

const API_ACTIONS = {
    GET_RECIPES: 'get_receipeName', GET_MY_RECIPES: 'get_my_recipes', GET_RECIPE_DETAILS: 'get_recipe_details',
    ADD_RECIPE: 'add_recipe', ADD_RECIPE_INGREDIENT: 'add_recipe_ingredient', ADD_RECIPE_STEP: 'add_recipe_step',
    UPDATE_RECIPE: 'update_recipe', DELETE_RECIPE: 'delete_recipe', CLEAR_RECIPE_DETAILS: 'clear_recipe_details',
    GET_RECIPE_INGREDIENTS: 'get_recipe_ingredients', GET_RECIPE_STEPS: 'get_recipe_steps',
    GET_ALL_INGREDIENTS: 'get_all_ingredients', ADD_INGREDIENT: 'add_ingredient',
    GET_CATEGORIES: 'get_categories', SEARCH_RECIPES: 'search_recipes',
    GET_ALL_UNITS: 'get_all_units', ADD_UNIT: 'add_unit', LOGIN: 'login', REGISTER: 'register'
};

const Api = {
    call: async (action, payload = {}, endpoint = 'app') => {
        const url = API_ENDPOINTS[endpoint] || API_ENDPOINTS.app;
        try {
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...payload }) });
            if (!response.ok) {
                try { const errorData = await response.json(); return { error: errorData.error || 'Hiba történt a kérés során.' }; } 
                catch (e) { return { error: 'API válasz hiba: ' + response.status }; }
            }
            return await response.json();
        } catch (error) { return { error: 'Nem sikerült kapcsolódni a szerverhez.' }; }
    }
};