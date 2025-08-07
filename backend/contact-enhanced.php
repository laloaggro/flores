<?php
// Incluir PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Cargar el autoloader de Composer
require_once 'vendor/autoload.php';

// Determinar si se está ejecutando desde la web o CLI
$isWeb = isset($_SERVER['REQUEST_METHOD']);

// Establecer encabezados para permitir solicitudes CORS (solo en entorno web)
if ($isWeb) {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header('Content-Type: application/json');
}

// Verificar que la solicitud sea POST
$requestMethod = $isWeb ? $_SERVER['REQUEST_METHOD'] : 'POST';
if ($requestMethod !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Método no permitido']);
    exit;
}

// Obtener los datos del formulario
if ($isWeb) {
    $input = file_get_contents('php://input');
} else {
    // Para pruebas CLI, leer de STDIN
    $input = file_get_contents('php://stdin');
}

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

// Verificar que las variables de entorno estén disponibles
$smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
$smtpPort = getenv('SMTP_PORT') ?: 587;
$smtpUsername = getenv('SMTP_USERNAME') ?: 'arreglosvictoriafloreria@gmail.com';
$smtpPassword = getenv('SMTP_PASSWORD');
$smtpEncryption = getenv('SMTP_ENCRYPTION') ?: 'tls';
$mailFromAddress = getenv('MAIL_FROM_ADDRESS') ?: 'arreglosvictoriafloreria@gmail.com';
$mailFromName = getenv('MAIL_FROM_NAME') ?: 'Arreglos Victoria Florería';
$mailToAddress = getenv('MAIL_TO_ADDRESS') ?: 'arreglosvictoriafloreria@gmail.com';
$mailToName = getenv('MAIL_TO_NAME') ?: 'Arreglos Victoria Florería';

// Verificar si la contraseña SMTP está configurada
if (empty($smtpPassword)) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Error de configuración: No se ha proporcionado la contraseña SMTP.',
        'status' => 'error',
        'debug' => 'SMTP_PASSWORD no está configurada'
    ]);
    exit;
}

// Crear una instancia de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUsername;
    $mail->Password   = $smtpPassword;
    $mail->SMTPSecure = $smtpEncryption;
    $mail->Port       = $smtpPort;
    
    // Habilitar depuración solo en desarrollo
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;

    // Configurar remitente y destinatario
    $mail->setFrom($mailFromAddress, $mailFromName);
    $mail->addAddress($mailToAddress, $mailToName);

    // Configurar contenido del correo
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = "Nuevo mensaje de contacto de la web - " . $name;
    
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
        <p>" . nl2br($message) . "</p>
        <hr>
        <p><small>Este mensaje fue enviado desde el formulario de contacto de la web de Arreglos Victoria Florería</small></p>
    </body>
    </html>
    ";

    $mail->Body = $mailBody;

    // Enviar el correo
    $mail->send();
    
    echo json_encode([
        'message' => '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.',
        'status' => 'success'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
        'status' => 'error',
        'debug' => $mail->ErrorInfo // Solo para depuración, se debería quitar en producción
    ]);
}
?>