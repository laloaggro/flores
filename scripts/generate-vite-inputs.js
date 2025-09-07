const fs = require('fs');
const path = require('path');

console.log('🔧 Generando configuración de entradas para Vite...\n');

// Directorio de páginas
const pagesDir = path.join(__dirname, '..', 'dev', 'pages');
const devRoot = path.join(__dirname, '..', 'dev');

// Obtener todas las páginas HTML en el directorio pages
const pageFiles = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.html'))
  .map(file => ({
    name: path.basename(file, '.html'),
    path: path.join('dev', 'pages', file)
  }));

// Agregar index.html del directorio raíz
pageFiles.push({
  name: 'main',
  path: path.join('dev', 'index.html')
});

// Generar configuración de entradas
let inputsConfig = '{\n';
pageFiles.forEach((page, index) => {
  const separator = index < pageFiles.length - 1 ? ',' : '';
  if (page.name === 'main') {
    inputsConfig += `    main: resolve(__dirname, 'dev/index.html')${separator}\n`;
  } else {
    inputsConfig += `    ${page.name}: resolve(__dirname, 'dev/pages/${page.name}.html')${separator}\n`;
  }
});
inputsConfig += '  }';

console.log('✅ Configuración de entradas generada:\n');
console.log(inputsConfig);

// Crear también un objeto para usar directamente en vite.config.js
const inputObject = {};
pageFiles.forEach(page => {
  if (page.name === 'main') {
    inputObject[page.name] = path.resolve(__dirname, '..', 'dev', 'index.html');
  } else {
    inputObject[page.name] = path.resolve(__dirname, '..', 'dev', 'pages', `${page.name}.html`);
  }
});

console.log('\n💾 Guardando configuración en vite-inputs.json...');
fs.writeFileSync(
  path.join(__dirname, '..', 'vite-inputs.json'),
  JSON.stringify(inputObject, null, 2)
);
console.log('✅ Configuración guardada en vite-inputs.json');