<?php
require_once 'config.php';

header('Content-Type: application/json');

// Verificar que la solicitud sea GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Verificar autenticación
if (!isAuthenticated()) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

try {
    // Obtener información del usuario actual
    $user = getCurrentUser($pdo);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Usuario no encontrado']);
        exit;
    }
    
    // No enviar la contraseña en la respuesta
    unset($user['password']);
    
    echo json_encode($user);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener el perfil del usuario']);
    error_log($e->getMessage());
}
?>