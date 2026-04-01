<?php
// API 
header('Content-Type: application/json; charset=utf-8');
require_once '../includes/queries.php';

$queryManager = new queries();
$request = json_decode(file_get_contents('php://input'), true);

try {
    $action = $request['action'] ?? '';

    //Minden action külön elágazás
    if ($action === 'get_receipeName') {
        $data = $queryManager->get_receipeName();
        echo json_encode($data);
    } else {
        echo json_encode(["error" => "Ismeretlen művelet"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>