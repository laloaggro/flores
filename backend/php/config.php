<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'floreria');
define('DB_USER', 'root');
define('DB_PASS', '');

// Crear conexión a la base de datos
try {
    $pdo = new PDO("sqlite:" . __DIR__ . "/../users.db");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Iniciar sesión
session_start();

// Función para generar un token de sesión
function generateToken($userId) {
    return md5(uniqid($userId, true));
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return isset($_SESSION['user_id']) && isset($_SESSION['token']);
}

// Función para obtener el usuario actual
function getCurrentUser($pdo) {
    if (!isAuthenticated()) {
        return null;
    }
    
    $stmt = $pdo->prepare("SELECT id, name, email, phone, role FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Función para verificar si el usuario es administrador
function isAdmin($pdo) {
    $user = getCurrentUser($pdo);
    return $user && $user['role'] === 'admin';
}
?>