#!/usr/bin/env node

// scripts/check-build.js
// Script para verificar el estado del empaquetado

const fs = require('fs');
const path = require('path');

// Función para verificar si el directorio dist existe
function checkDistDirectory() {
    const distPath = path.resolve(__dirname, '../dist');
    if (fs.existsSync(distPath)) {
        console.log('✅ Directorio dist existe');
        const files = fs.readdirSync(distPath);
        console.log(`📁 Archivos en dist: ${files.length}`);
        files.forEach(file => {
            const stats = fs.statSync(path.join(distPath, file));
            console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file} (${stats.size} bytes)`);
        });
        return true;
    } else {
        console.log('❌ Directorio dist no existe');
        return false;
    }
}

// Función para verificar archivos HTML
function checkHtmlFiles() {
    const frontendPath = path.resolve(__dirname, '../frontend');
    const htmlFiles = fs.readdirSync(frontendPath)
        .filter(file => file.endsWith('.html'));
    
    console.log(`\n📄 Archivos HTML encontrados en frontend: ${htmlFiles.length}`);
    htmlFiles.forEach(file => {
        console.log(`  📄 ${file}`);
    });
    
    return htmlFiles;
}

// Función para verificar configuración de Vite
function checkViteConfig() {
    const viteConfigPath = path.resolve(__dirname, '../vite.config.js');
    if (fs.existsSync(viteConfigPath)) {
        console.log('✅ Archivo de configuración de Vite encontrado');
        return true;
    } else {
        console.log('❌ Archivo de configuración de Vite no encontrado');
        return false;
    }
}

// Función principal
async function main() {
    console.log('🔍 Verificando estado del empaquetado...\n');
    
    // Verificar configuración de Vite
    checkViteConfig();
    
    // Verificar archivos HTML
    checkHtmlFiles();
    
    // Verificar directorio dist
    checkDistDirectory();
    
    console.log('\n✅ Verificación completada');
}

// Ejecutar verificación
main();