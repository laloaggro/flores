<?php
// Establecer encabezados para permitir solicitudes CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Método no permitido']);
    exit;
}

// Obtener los datos del formulario
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar los datos
if (!isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Faltan campos requeridos']);
    exit;
}

$name = htmlspecialchars(trim($data['name']));
$email = htmlspecialchars(trim($data['email']));
$phone = isset($data['phone']) ? htmlspecialchars(trim($data['phone'])) : '';
$message = htmlspecialchars(trim($data['message']));

// Validar formato de correo electrónico
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Formato de correo electrónico inválido']);
    exit;
}

// Configurar los detalles del correo
$to = "arreglosvictoriafloreria@gmail.com"; // Cambiar por el correo real del destinatario
$subject = "Nuevo mensaje de contacto de la web - " . $name;

// Crear el contenido del correo en HTML
$mailBody = "
<html>
<head>
    <title>Nuevo mensaje de contacto</title>
</head>
<body>
    <h2>Nuevo mensaje de contacto desde la web</h2>
    <p><strong>Nombre:</strong> {$name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Teléfono:</strong> {$phone}</p>
    <p><strong>Mensaje:</strong></p>
    <p>{$message}</p>
</body>
</html>
";

// Configurar encabezados
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

// Enviar el correo
if (mail($to, $subject, $mailBody, $headers)) {
    echo json_encode([
        'message' => '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.',
        'status' => 'success'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'message' => 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
        'status' => 'error'
    ]);
}
?>