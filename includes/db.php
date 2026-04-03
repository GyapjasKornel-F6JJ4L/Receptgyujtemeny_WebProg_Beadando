<?php
// Adatbázis kapcsolat
class Database
{
    private $host = "localhost";
    private $db = "receptgyűjtemény";
    private $user = "root";
    private $password = "";
    private $charset = "utf8mb4"; 

    protected function connect()
    {
        try {

            $dsn = "mysql:host=$this->host;dbname=$this->db;charset=$this->charset";
            $pdo = new PDO($dsn, $this->user, $this->password, ([
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Hibák kivételként (Exception)
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Asszociatív tömbök
                PDO::ATTR_EMULATE_PREPARES => false, // Valódi prepare statementek
            ]));
            return $pdo;
        } catch (PDOException $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            die(json_encode(["error" => "Kapcsolódási hiba: " . $e->getMessage()]));
        }
    }
}
?>