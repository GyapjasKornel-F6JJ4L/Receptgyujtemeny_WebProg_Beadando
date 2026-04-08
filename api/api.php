<?php
// API 
header('Content-Type: application/json; charset=utf-8');
require_once '../includes/queries.php';

$queryManager = new queries();
$input = file_get_contents('php://input');
$request = json_decode($input, true);

if (!$request) {
    $request = [];
}

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
        $image = $request['image'] ?? null;

        if (empty($title) || empty($userId)) {
             throw new Exception("A recept neve kötelező, és be kell jelentkezned hozzá!");
        }

        $result = $queryManager->addRecipe($userId, $title, $description, $categoryId, $image);
        echo json_encode($result);
    }

    // 6. Recept hozzávalóinak hozzáadása
    elseif ($action === 'add_recipe_ingredient') {
        $recipeId = $request['recipe_id'] ?? null;
        $ingredientId = $request['ingredient_id'] ?? null;
        $quantity = $request['quantity'] ?? null;
        $unit = $request['unit'] ?? 'g';

        if (empty($recipeId) || empty($ingredientId)) {
            throw new Exception("Recept ID és hozzávaló ID kötelező!");
        }

        $result = $queryManager->addRecipeIngredient($recipeId, $ingredientId, $quantity, $unit);
        echo json_encode($result);
    }

    // 7. Recept lépésének hozzáadása
    elseif ($action === 'add_recipe_step') {
        $recipeId = $request['recipe_id'] ?? null;
        $stepNumber = $request['step_number'] ?? 1;
        $description = $request['description'] ?? '';

        if (empty($recipeId) || empty($description)) {
            throw new Exception("Recept ID és lépés leírása kötelező!");
        }

        $result = $queryManager->addRecipeStep($recipeId, $stepNumber, $description);
        echo json_encode($result);
    }

    // 8. Recept hozzávalóinak lekérése
    elseif ($action === 'get_recipe_ingredients') {
        $recipeId = $request['recipe_id'] ?? null;
        if (empty($recipeId)) {
            throw new Exception("Recept ID kötelező!");
        }
        $data = $queryManager->get_recipe_ingredients($recipeId);
        echo json_encode($data);
    }

    // 9. Recept lépéseinek lekérése
    elseif ($action === 'get_recipe_steps') {
        $recipeId = $request['recipe_id'] ?? null;
        if (empty($recipeId)) {
            throw new Exception("Recept ID kötelező!");
        }
        $data = $queryManager->get_recipe_steps($recipeId);
        echo json_encode($data);
    }

    // 10. Összes hozzávaló lekérése (kiválasztáshoz)
    elseif ($action === 'get_all_ingredients') {
        $data = $queryManager->get_all_ingredients();
        echo json_encode($data);
    }

    // 11. Új hozzávaló hozzáadása
    elseif ($action === 'add_ingredient') {
        $name = $request['name'] ?? '';
        if (empty($name)) {
            throw new Exception("A hozzavaló neve kötelező!");
        }
        $result = $queryManager->addIngredient($name);
        echo json_encode($result);
    }

    // 12. Kategóriák lekérése
    elseif ($action === 'get_categories') {
        $data = $queryManager->get_categories();
        echo json_encode($data);
    }

    // 13. Receptek keresése/szűrése
    elseif ($action === 'search_recipes') {
        $categoryId = $request['category_id'] ?? null;
        $searchTerm = $request['search'] ?? null;
        $userId = $request['user_id'] ?? null;
        $data = $queryManager->search_recipes($categoryId, $searchTerm, $userId);
        echo json_encode($data);
    }

    // 14. Kép feltöltése
    elseif ($action === 'upload_image') {
        if (!isset($_FILES['image'])) {
            throw new Exception("Kép fájl szükséges!");
        }
        
        $file = $_FILES['image'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception("Csak JPG, PNG, GIF vagy WEBP formátum engedélyezett!");
        }
        
        if ($file['size'] > 5000000) {
            throw new Exception("A kép maximális mérete 5MB!");
        }
        
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $newFilename = uniqid('recipe_') . '.' . $extension;
        $uploadDir = '../uploads/';
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $targetPath = $uploadDir . $newFilename;
        
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            echo json_encode([
                "success" => true,
                "filename" => $newFilename,
                "path" => 'uploads/' . $newFilename
            ]);
        } else {
            throw new Exception("Hiba a fájl feltöltése során!");
        }
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