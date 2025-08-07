<?php
// Script para verificar que las variables de entorno se están pasando correctamente

echo "=== Verificación de Variables de Entorno ===\n\n";

$required_vars = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USERNAME',
    'SMTP_PASSWORD',
    'SMTP_ENCRYPTION',
    'MAIL_FROM_ADDRESS',
    'MAIL_FROM_NAME',
    'MAIL_TO_ADDRESS',
    'MAIL_TO_NAME'
];

$missing_vars = [];
$present_vars = [];

foreach ($required_vars as $var) {
    $value = getenv($var);
    if ($value === false || $value === '') {
        $missing_vars[] = $var;
    } else {
        $present_vars[$var] = $value;
    }
}

if (empty($missing_vars)) {
    echo "✅ Todas las variables de entorno están presentes:\n";
    foreach ($present_vars as $key => $value) {
        // Ocultar la contraseña en la salida
        if ($key === 'SMTP_PASSWORD') {
            echo "  $key: " . str_repeat('*', strlen($value)) . "\n";
        } else {
            echo "  $key: $value\n";
        }
    }
} else {
    echo "❌ Variables de entorno faltantes:\n";
    foreach ($missing_vars as $var) {
        echo "  - $var\n";
    }
    
    echo "\n✅ Variables presentes:\n";
    foreach ($present_vars as $key => $value) {
        // Ocultar la contraseña en la salida
        if ($key === 'SMTP_PASSWORD') {
            echo "  $key: " . str_repeat('*', strlen($value)) . "\n";
        } else {
            echo "  $key: $value\n";
        }
    }
}

echo "\n=== Fin de la verificación ===\n";
?>