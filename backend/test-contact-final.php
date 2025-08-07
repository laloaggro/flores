#!/usr/bin/env php
<?php

// Preparar datos de prueba
$testData = [
    'name' => 'Usuario de Prueba',
    'email' => 'test@ejemplo.com',
    'phone' => '123456789',
    'message' => 'Mensaje de prueba para verificar el sistema de contacto.'
];

// Convertir a JSON
$jsonData = json_encode($testData);

// Guardar en un archivo temporal
file_put_contents('temp_input.json', $jsonData);

echo "Datos de prueba preparados:\n";
echo json_encode($testData, JSON_PRETTY_PRINT) . "\n\n";

// Ejecutar el script de contacto con los datos de prueba
echo "Ejecutando el script de contacto...\n";
echo "Comando: cd /home/laloaggro/Proyectos/flores/backend && php contact-enhanced.php < temp_input.json\n\n";

// Ejecutar el comando
exec('cd /home/laloaggro/Proyectos/flores/backend && php contact-enhanced.php < temp_input.json 2>&1', $output, $returnCode);

echo "Código de retorno: " . $returnCode . "\n";
echo "Salida:\n";
echo implode("\n", $output) . "\n";

// Limpiar archivo temporal
unlink('temp_input.json');

echo "\nPrueba completada.\n";
?>