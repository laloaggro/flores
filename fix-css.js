const fs = require('fs');
const path = require('path');

// Ruta al archivo CSS
const cssPath = path.join(__dirname, 'dev', 'assets', 'css', 'combined.css');

// Leer el archivo CSS
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Dividir el contenido en líneas
let lines = cssContent.split('\n');

// Buscar líneas que contienen solo una llave de cierre
let problematicLines = [];
for (let i = 0; i < lines.length; i++) {
  // Verificar si la línea contiene solo espacios y una llave de cierre
  if (lines[i].trim() === '}') {
    // Verificar si hay una línea anterior con contenido
    let hasPreviousContent = false;
    for (let j = i - 1; j >= 0; j--) {
      if (lines[j].trim() !== '') {
        if (!lines[j].trim().endsWith('{') && !lines[j].trim().endsWith(',')) {
          hasPreviousContent = true;
        }
        break;
      }
    }
    
    if (!hasPreviousContent) {
      problematicLines.push({
        line: i + 1,
        content: lines[i]
      });
    }
  }
}

console.log('Líneas problemáticas encontradas:');
console.log(problematicLines);

// Eliminar las líneas problemáticas
let newLines = [];
for (let i = 0; i < lines.length; i++) {
  let isProblematic = false;
  for (let j = 0; j < problematicLines.length; j++) {
    if (problematicLines[j].line === i + 1) {
      isProblematic = true;
      break;
    }
  }
  
  if (!isProblematic) {
    newLines.push(lines[i]);
  } else {
    console.log(`Eliminando línea ${i + 1}: ${lines[i]}`);
  }
}

// Escribir el archivo corregido
fs.writeFileSync(cssPath, newLines.join('\n'));

console.log('Archivo CSS corregido guardado.');