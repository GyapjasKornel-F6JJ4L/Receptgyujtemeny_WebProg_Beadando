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
        
        // Új felhasználó beszúrása
        $sql = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $sql->execute([$username, $email, $password]);
        
        return ["success" => true, "message" => "Sikeres regisztráció!"];
    }

    // 3. Bejelentkezés
    public function loginUser($username, $password) {
        $pdo = $this->connect();
        
        $sql = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ?");
        $sql->execute([$username]);
        $user = $sql->fetch();

        // Jelszó ellenőrzése
        if ($user && $user['password'] === $password) {
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
    public function addRecipe($userId, $title, $description, $categoryId) {
        $pdo = $this->connect();
        
        // Alapértelmezett kategória, ha nem lenne megadva
        $categoryId = $categoryId ?: 1; 

        $sql = $pdo->prepare("INSERT INTO recipes (user_id, category_id, title, description) VALUES (?, ?, ?, ?)");
        $sql->execute([$userId, $categoryId, $title, $description]);
        
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
}
?>