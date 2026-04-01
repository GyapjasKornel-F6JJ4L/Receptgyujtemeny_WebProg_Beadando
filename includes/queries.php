<?php

require_once 'db.php';

class queries extends Database
{
    //Összes lekérdezés ide kerül külön funkcióként
    public function get_receipeName()
    {
        $pdo = $this->connect();
        $sql = $pdo->prepare("SELECT title FROM recipes");
        $sql->execute();
        return $sql->fetchAll();
    }
}

?>