<?php
// Script para verificar la configuración del servidor de correo

echo "<h1>Verificación de configuración de correo</h1>";

// Verificar si la función mail está disponible
if (function_exists('mail')) {
    echo "<p style='color: green;'>✓ La función mail() está disponible</p>";
} else {
    echo "<p style='color: red;'>✗ La función mail() NO está disponible</p>";
    echo "<p>La función mail() debe estar habilitada en php.ini</p>";
    exit;
}

// Verificar configuración de sendmail
$sendmailPath = ini_get('sendmail_path');
if (!empty($sendmailPath)) {
    echo "<p style='color: green;'>✓ Ruta de sendmail configurada: $sendmailPath</p>";
} else {
    echo "<p style='color: orange;'>⚠ Ruta de sendmail NO configurada</p>";
    echo "<p>Esto puede ser normal en servidores Windows</p>";
}

// Verificar configuración SMTP en Windows
$smtp = ini_get('SMTP');
if (!empty($smtp)) {
    echo "<p style='color: green;'>✓ Servidor SMTP configurado: $smtp</p>";
} else {
    echo "<p style='color: orange;'>⚠ Servidor SMTP NO configurado</p>";
}

$smtpPort = ini_get('smtp_port');
if (!empty($smtpPort)) {
    echo "<p style='color: green;'>✓ Puerto SMTP configurado: $smtpPort</p>";
} else {
    echo "<p style='color: orange;'>⚠ Puerto SMTP NO configurado (usando puerto por defecto)</p>";
}

// Mostrar información adicional
echo "<h2>Información adicional</h2>";
echo "<p>Versión de PHP: " . phpversion() . "</p>";
echo "<p>Sistema operativo: " . php_uname() . "</p>";

// Verificar si podemos escribir en el directorio temporal
$tempFile = sys_get_temp_dir() . '/mail_test.txt';
if (is_writable(sys_get_temp_dir())) {
    echo "<p style='color: green;'>✓ Directorio temporal escribible</p>";
} else {
    echo "<p style='color: red;'>✗ Directorio temporal NO escribible</p>";
}

echo "<h2>Prueba de envío</h2>";
echo "<p><a href='test-mail.php'>Hacer prueba de envío de correo</a></p>";
echo "<p><a href='../test-contact.html'>Probar formulario de contacto</a></p>";
?>