<?php
// Cargar el autoloader de Composer
require_once 'vendor/autoload.php';

// Cargar variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Incluir el script de contacto
include 'contact-enhanced.php';
?>