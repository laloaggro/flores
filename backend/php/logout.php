<?php
require_once 'config.php';

header('Content-Type: application/json');

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

try {
    // Destruir la sesión
    session_destroy();
    
    echo json_encode([
        'message' => 'Sesión cerrada exitosamente'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al cerrar sesión']);
    error_log($e->getMessage());
}
?>