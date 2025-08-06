<?php
// Script de prueba para verificar el envío de correos

// Configurar los detalles del correo
$to = "arreglosvictoriafloreria@gmail.com";
$subject = "Prueba de envío de correo - " . date('Y-m-d H:i:s');

$mailBody = "
<html>
<head>
    <title>Prueba de envío de correo</title>
</head>
<body>
    <h2>Prueba de envío de correo</h2>
    <p>Este es un correo de prueba enviado desde el script de prueba.</p>
    <p>Fecha y hora: " . date('Y-m-d H:i:s') . "</p>
    <p>IP del servidor: " . $_SERVER['SERVER_ADDR'] . "</p>
</body>
</html>
";

// Configurar encabezados
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: noreply@arreglosvictoria.com" . "\r\n";

// Enviar el correo
if (mail($to, $subject, $mailBody, $headers)) {
    echo "<h1>Correo enviado exitosamente</h1>";
    echo "<p>Se ha enviado un correo de prueba a: $to</p>";
    echo "<p>Asunto: $subject</p>";
    echo "<a href='../test-contact.html'>Volver a la prueba del formulario</a>";
} else {
    echo "<h1>Error al enviar el correo</h1>";
    echo "<p>No se pudo enviar el correo de prueba.</p>";
    echo "<p>Verifica la configuración del servidor de correo.</p>";
    echo "<a href='../test-contact.html'>Volver a la prueba del formulario</a>";
}
?>