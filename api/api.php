<?php
// API 
header('Content-Type: application/json; charset=utf-8');
require_once '../includes/queries.php';

$queryManager = new queries();
$request = json_decode(file_get_contents('php://input'), true);

try {
    $action = $request['action'] ?? '';

    // 1. Receptek lekérése (nyilvános lista)
    if ($action === 'get_receipeName') {
        $data = $queryManager->get_receipeName();
        echo json_encode($data);
    }

    // 1b. Bejelentkezett felhasználó saját receptjei
    elseif ($action === 'get_my_recipes') {
        $userId = $request['user_id'] ?? null;
        if (!$userId) {
            throw new Exception("Felhasználó azonosító szükséges!");
        }
        $data = $queryManager->get_recipes_by_user_id($userId);
        echo json_encode($data);
    }
    
    // 2. Recept részleteinek lekérése
    elseif ($action === 'get_recipe_details') {
        $id = $request['id'] ?? null;
        if (!$id) {
            throw new Exception("Recept ID szükséges!");
        }
        $data = $queryManager->get_recipe_details($id);
        if ($data) {
            echo json_encode($data);
        } else {
            throw new Exception("Recept nem található!");
        }
    } 
    
    // 3. Regisztráció
    elseif ($action === 'register') {
        $username = $request['username'] ?? '';
        $password = $request['password'] ?? '';
        $email = $request['email'] ?? null;
        
        if (empty($username) || empty($password)) {
            throw new Exception("Minden mezőt ki kell tölteni!");
        }
        
        $result = $queryManager->registerUser($username, $password, $email);
        echo json_encode($result);
    } 
    
    // 4. Bejelentkezés
    elseif ($action === 'login') {
        $username = $request['username'] ?? '';
        $password = $request['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            throw new Exception("Minden mezőt ki kell tölteni!");
        }
        
        $result = $queryManager->loginUser($username, $password);
        echo json_encode($result);
    }

    // 5. Új recept hozzáadása
    elseif ($action === 'add_recipe') {
        $userId = $request['user_id'] ?? null;
        $title = $request['title'] ?? '';
        $description = $request['description'] ?? '';
        $categoryId = $request['category_id'] ?? 1;

        if (empty($title) || empty($userId)) {
             throw new Exception("A recept neve kötelező, és be kell jelentkezned hozzá!");
        }

        $result = $queryManager->addRecipe($userId, $title, $description, $categoryId);
        echo json_encode($result);
    }
    
    // Ha ismeretlen a kérés
    else {
        throw new Exception("Ismeretlen művelet: " . $action);
    }

} catch (Exception $e) {
    http_response_code(400); // 400 Bad Request
    echo json_encode(["error" => $e->getMessage()]);
}
?>