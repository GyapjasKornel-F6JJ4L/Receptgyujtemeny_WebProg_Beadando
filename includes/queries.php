<?php

require_once 'db.php';

class queries extends Database
{
    // 1. Összes recept lekérése (id-vel együtt!)
    public function get_receipeName()
    {
        $pdo = $this->connect();
        $sql = $pdo->prepare("SELECT id, title FROM recipes");
        $sql->execute();
        return $sql->fetchAll();
    }

    // 2. Regisztráció
    public function registerUser($username, $password) {
        $pdo = $this->connect();
        
        // Ellenőrizzük, létezik-e már a felhasználónév
        $check = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $check->execute([$username]);
        if ($check->rowCount() > 0) {
            throw new Exception("Ez a felhasználónév már foglalt!");
        }

        // Jelszó titkosítása
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Új felhasználó beszúrása
        $sql = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
        $sql->execute([$username, $hashedPassword]);
        
        return ["success" => true, "message" => "Sikeres regisztráció!"];
    }

    // 3. Bejelentkezés
    public function loginUser($username, $password) {
        $pdo = $this->connect();
        
        $sql = $pdo->prepare("SELECT id, username, password_hash FROM users WHERE username = ?");
        $sql->execute([$username]);
        $user = $sql->fetch();

        // Jelszó ellenőrzése a titkosított hash alapján
        if ($user && password_verify($password, $user['password_hash'])) {
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
}
?>