const Api = {
    // Központi függvény a PHP backend hívására
    call: async (action, payload = {}) => {
        try {
            // Itt a te korábbi beállításod szerepel (api/api.php)
            const response = await fetch('api/api.php', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: action, ...payload })
            });
            
            return await response.json();
        } catch (error) {
            console.error("Hálózati hiba az API hívás során:", error);
            return { error: "Nem sikerült kapcsolódni a szerverhez." };
        }
    }
};