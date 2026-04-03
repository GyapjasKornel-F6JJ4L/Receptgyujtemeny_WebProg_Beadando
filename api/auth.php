<?php
// api/auth.php
header('Content-Type: application/json; charset=utf-8');
require_once '../includes/queries.php';

$queryManager = new queries();
$request = json_decode(file_get_contents('php://input'), true);

try {
    $action = $request['action'] ?? '';
    $username = $request['username'] ?? '';
    $password = $request['password'] ?? '';
    $email = $request['email'] ?? null;

    if (empty($username) || empty($password)) {
        throw new Exception("Minden mezőt ki kell tölteni!");
    }

    if ($action === 'register') {
        $result = $queryManager->registerUser($username, $password, $email);
        echo json_encode($result);
    } 
    elseif ($action === 'login') {
        $result = $queryManager->loginUser($username, $password);
        echo json_encode($result);
    } 
    else {
        throw new Exception("Ismeretlen művelet");
    }

} catch (Exception $e) {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => $e->getMessage()]);
}
?>