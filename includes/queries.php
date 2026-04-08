<?php

require_once 'db.php';

class queries extends Database
{
    // 1. Összes recept lekérése (lista / kártya mezők)
    public function get_receipeName()
    {
        $pdo = $this->connect();
        $sql = $pdo->prepare(
            "SELECT r.id, r.title, r.description, r.image, c.name AS type
             FROM recipes r
             LEFT JOIN categories c ON r.category_id = c.id
             ORDER BY r.id"
        );
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    // 1b. Egy felhasználó receptjei
    public function get_recipes_by_user_id($userId)
    {
        $pdo = $this->connect();
        $sql = $pdo->prepare(
            "SELECT r.id, r.title, r.description, r.image, c.name AS type
             FROM recipes r
             LEFT JOIN categories c ON r.category_id = c.id
             WHERE r.user_id = ?
             ORDER BY r.id"
        );
        $sql->execute([(int) $userId]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    // 2. Regisztráció
    public function registerUser($username, $password, $email = null) {
        $pdo = $this->connect();
        
        // Ellenőrizzük, létezik-e már a felhasználónév
        $check = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $check->execute([$username]);
        if ($check->rowCount() > 0) {
            throw new Exception("Ez a felhasználónév már foglalt!");
        }

        // Email ellenőrzés, ha meg van adva
        if ($email) {
            $emailCheck = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $emailCheck->execute([$email]);
            if ($emailCheck->rowCount() > 0) {
                throw new Exception("Ez az email cím már használatban van!");
            }
        }
        
        // Jelszó hash-elése bcrypt-kel
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Új felhasználó beszúrása
        $sql = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $sql->execute([$username, $email, $hashedPassword]);
        
        return ["success" => true, "message" => "Sikeres regisztráció!"];
    }

    // 3. Bejelentkezés
    public function loginUser($username, $password) {
        $pdo = $this->connect();
        
        $sql = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ?");
        $sql->execute([$username]);
        $user = $sql->fetch();

        // Jelszó ellenőrzése password_verify()-vel
        if ($user && password_verify($password, $user['password'])) {
            return [
                "success" => true, 
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username']
                ]
            ];
        } else {
            throw new Exception("Hibás felhasználónév vagy jelszó!");
        }
    }

    // 4. Új recept hozzáadása
    public function addRecipe($userId, $title, $description, $categoryId, $image = null) {
        $pdo = $this->connect();
        
        $categoryId = $categoryId ?: 1; 
        $createdAt = date('Y-m-d');

        $sql = $pdo->prepare("INSERT INTO recipes (user_id, category_id, title, description, image, created_at) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->execute([$userId, $categoryId, $title, $description, $image, $createdAt]);
        
        return [
            "success" => true, 
            "message" => "Recept sikeresen hozzáadva!",
            "recipe_id" => $pdo->lastInsertId()
        ];
    }

    // 5. Recept részleteinek lekérése
    public function get_recipe_details($id) {
        $pdo = $this->connect();
        
        $sql = $pdo->prepare("SELECT r.*, c.name as category, u.username as author FROM recipes r 
                              LEFT JOIN categories c ON r.category_id = c.id 
                              LEFT JOIN users u ON r.user_id = u.id 
                              WHERE r.id = ?");
        $sql->execute([$id]);
        return $sql->fetch();
    }

    // 6. Hozzávalók hozzáadása recipe_ingredients táblához
    public function addRecipeIngredient($recipeId, $ingredientId, $quantity, $unit) {
        $pdo = $this->connect();
        
        $sql = $pdo->prepare("INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)");
        $sql->execute([$recipeId, $ingredientId, $quantity, $unit]);
        
        return ["success" => true, "ingredient_id" => $pdo->lastInsertId()];
    }

    // 7. Lépések hozzáadása steps táblához
    public function addRecipeStep($recipeId, $stepNumber, $description) {
        $pdo = $this->connect();
        
        $sql = $pdo->prepare("INSERT INTO steps (recipe_id, step_number, description) VALUES (?, ?, ?)");
        $sql->execute([$recipeId, $stepNumber, $description]);
        
        return ["success" => true, "step_id" => $pdo->lastInsertId()];
    }

    // 8. Recept hozzávalóinak lekérése
    public function get_recipe_ingredients($recipeId) {
        $pdo = $this->connect();
        
        $sql = $pdo->prepare("SELECT ri.id, ri.quantity, ri.unit, i.name as ingredient_name, i.id as ingredient_id 
                              FROM recipe_ingredients ri
                              LEFT JOIN ingredients i ON ri.ingredient_id = i.id
                              WHERE ri.recipe_id = ?");
        $sql->execute([$recipeId]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    // 9. Recept lépéseinek lekérése
    public function get_recipe_steps($recipeId) {
        $pdo = $this->connect();
        
        $sql = $pdo->prepare("SELECT id, step_number, description FROM steps WHERE recipe_id = ? ORDER BY step_number");
        $sql->execute([$recipeId]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    // 10. Összes hozzávaló lekérése (kiválasztáshoz)
    public function get_all_ingredients() {
        $pdo = $this->connect();
        
        $sql = $pdo->prepare("SELECT id, name FROM ingredients ORDER BY name");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    // 11. Új hozzávaló hozzáadása
    public function addIngredient($name) {
        $pdo = $this->connect();
        
        $check = $pdo->prepare("SELECT id FROM ingredients WHERE name = ?");
        $check->execute([$name]);
        if ($check->rowCount() > 0) {
            $existing = $check->fetch();
            return ["success" => true, "ingredient_id" => $existing['id'], "message" => "A hozzávaló már létezik."];
        }
        
        $sql = $pdo->prepare("INSERT INTO ingredients (name) VALUES (?)");
        $sql->execute([$name]);
        
        return ["success" => true, "ingredient_id" => $pdo->lastInsertId()];
    }

    // 12. Kategóriák lekérése
    public function get_categories() {
        $pdo = $this->connect();
        
        $sql = $pdo->prepare("SELECT id, name FROM categories ORDER BY id");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    // 13. Receptek szűrése kategória és/vagy keresés alapján
    public function search_recipes($categoryId = null, $searchTerm = null, $userId = null) {
        $pdo = $this->connect();
        
        $sql = "SELECT r.id, r.title, r.description, r.image, c.name AS type
                FROM recipes r
                LEFT JOIN categories c ON r.category_id = c.id
                WHERE 1=1";
        $params = [];

        if ($userId) {
            $sql .= " AND r.user_id = ?";
            $params[] = (int) $userId;
        }
        
        if ($categoryId && $categoryId !== 'all') {
            $sql .= " AND r.category_id = ?";
            $params[] = (int) $categoryId;
        }
        
        if ($searchTerm && trim($searchTerm) !== '') {
            $sql .= " AND (r.title LIKE ? OR r.description LIKE ?)";
            $search = '%' . trim($searchTerm) . '%';
            $params[] = $search;
            $params[] = $search;
        }
        
        $sql .= " ORDER BY r.id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>