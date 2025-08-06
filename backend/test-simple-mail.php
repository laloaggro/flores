<?php
// Script simple para probar el envío de correo

$to = "arreglosvictoriafloreria@gmail.com";
$subject = "Prueba de envío de correo simple";
$message = "Este es un correo de prueba enviado desde PHP con sendmail.";
$headers = "From: noreply@localhost\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo "Correo enviado exitosamente.";
} else {
    echo "Error al enviar el correo.";
}
?>