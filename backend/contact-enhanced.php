<?php
// Incluir PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Cargar el autoloader de Composer
require_once 'vendor/autoload.php';

// Cargar variables de entorno
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

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

// Crear una instancia de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host       = $_ENV['SMTP_HOST'] ?: 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USERNAME'] ?: 'arreglosvictoriafloreria@gmail.com';
    $mail->Password   = $_ENV['SMTP_PASSWORD'];
    $mail->SMTPSecure = $_ENV['SMTP_ENCRYPTION'] ?: PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $_ENV['SMTP_PORT'] ?: 587;

    // Configurar remitente y destinatario
    $mail->setFrom($_ENV['MAIL_FROM_ADDRESS'] ?: 'arreglosvictoriafloreria@gmail.com', 
                   $_ENV['MAIL_FROM_NAME'] ?: 'Arreglos Victoria Florería');
    $mail->addAddress($_ENV['MAIL_TO_ADDRESS'] ?: 'arreglosvictoriafloreria@gmail.com', 
                      $_ENV['MAIL_TO_NAME'] ?: 'Arreglos Victoria Florería');

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