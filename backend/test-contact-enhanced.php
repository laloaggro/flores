<?php
// Test para verificar la funcionalidad de contacto mejorada
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST = [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'phone' => '123456789',
    'message' => 'Este es un mensaje de prueba para verificar la funcionalidad.'
];

// Simular input
$input = json_encode($_POST);
file_put_contents('php://stdin', $input);

// Incluir el script principal
include 'contact-enhanced.php';
?>