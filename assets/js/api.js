// API endpontok és központi hívó függvény
const API_ENDPOINTS = {
    app: 'api/api.php',
    auth: 'api/auth.php'
};

// API akciók az alkalmazásban
const API_ACTIONS = {
    GET_RECIPES: 'get_receipeName',
    GET_MY_RECIPES: 'get_my_recipes',
    GET_RECIPE_DETAILS: 'get_recipe_details',
    ADD_RECIPE: 'add_recipe',
    LOGIN: 'login',
    REGISTER: 'register'
};

const Api = {
    // action: megadott akció (pl. get_receipeName, get_recipe_details, login, register)
    // payload: adatok objektumként
    // endpoint: 'app' vagy 'auth' végpont
    call: async (action, payload = {}, endpoint = 'app') => {
        const url = API_ENDPOINTS[endpoint] || API_ENDPOINTS.app;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...payload })
            });

            if (!response.ok) {
                console.error('API HTTP hiba:', response.status);
                return { error: 'API válasz hiba: ' + response.status };
            }

            return await response.json();
        } catch (error) {
            console.error('Hálózati hiba az API hívás során:', error);
            return { error: 'Nem sikerült kapcsolódni a szerverhez.' };
        }
    }
};