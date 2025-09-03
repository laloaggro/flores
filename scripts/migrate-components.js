#!/usr/bin/env node

// scripts/migrate-components.js
// Script para ayudar en la migración de componentes web a módulos ES6

const fs = require('fs');
const path = require('path');

// Componentes a migrar
const componentsToMigrate = [
  {
    name: 'Header',
    src: 'frontend/components/header/Header.js',
    dest: 'frontend/assets/js/components/ui/Header.js',
    type: 'navigation'
  },
  {
    name: 'Footer',
    src: 'frontend/components/header/Footer.js',
    dest: 'frontend/assets/js/components/ui/Footer.js',
    type: 'navigation'
  },
  {
    name: 'Testimonials',
    src: 'frontend/components/Testimonials.js',
    dest: 'frontend/assets/js/components/ui/Testimonials.js',
    type: 'content'
  },
  {
    name: 'Products',
    src: 'frontend/components/product/Products.js',
    dest: 'frontend/assets/js/components/product/Products.js',
    type: 'product'
  },
  {
    name: 'ProductCard',
    src: 'frontend/components/product/ProductCard.js',
    dest: 'frontend/assets/js/components/product/ProductCard.js',
    type: 'product'
  },
  {
    name: 'CartItem',
    src: 'frontend/components/cart/CartItem.js',
    dest: 'frontend/assets/js/components/cart/CartItem.js',
    type: 'cart'
  }
];

// Función para crear directorios
function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Función para migrar un componente
function migrateComponent(component) {
  try {
    const srcPath = path.resolve(__dirname, '..', component.src);
    const destPath = path.resolve(__dirname, '..', component.dest);
    
    // Verificar si el archivo fuente existe
    if (!fs.existsSync(srcPath)) {
      console.warn(`Componente no encontrado: ${srcPath}`);
      return false;
    }
    
    // Leer el contenido del componente
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Actualizar la definición del componente
    // Reemplazar customElements.define con export default
    content = content.replace(
      /customElements\.define\(['"]([\w-]+)['"],\s*(\w+)\);?/g,
      'export default $2;'
    );
    
    // Añadir comentarios sobre la migración
    const migrationComment = `// Migrado de componente web personalizado a módulo ES6\n`;
    content = migrationComment + content;
    
    // Crear directorio de destino
    const destDir = path.dirname(destPath);
    createDir(destDir);
    
    // Escribir el archivo migrado
    fs.writeFileSync(destPath, content, 'utf8');
    
    console.log(`Migrado: ${component.name} -> ${destPath}`);
    return true;
  } catch (error) {
    console.error(`Error migrando ${component.name}:`, error.message);
    return false;
  }
}

// Función para generar documentación de migración
function generateMigrationDocs() {
  const docsPath = path.resolve(__dirname, '../docs/MIGRATION_GUIDE.md');
  const docsContent = `# Guía de Migración de Componentes Web a Módulos ES6

## Componentes Migrados

${componentsToMigrate.map(comp => `- [${comp.name}](${comp.dest})`).join('\n')}

## Cambios Requeridos

### En archivos HTML:
Antes:
\`\`\`html
<header-component></header-component>
<script src="components/Header.js"></script>
\`\`\`

Después:
\`\`\`html
<script type="module">
  import Header from './assets/js/components/ui/Header.js';
  // Usar el componente como módulo
</script>
\`\`\`

### En archivos JavaScript:
Antes:
\`\`\`javascript
// No era necesario importar explícitamente
\`\`\`

Después:
\`\`\`javascript
import Header from '../ui/Header.js';
\`\`\`

## Beneficios de la Migración

1. **Compatibilidad con empaquetadores**: Los módulos ES6 funcionan mejor con Vite y otras herramientas modernas
2. **Mejor organización**: Los componentes se integran en la estructura de directorios existente
3. **Tree shaking**: Los empaquetadores pueden eliminar código no utilizado
4. **Mejor mantenimiento**: Estructura más coherente con estándares modernos

## Próximos Pasos

1. Actualizar todos los archivos HTML para usar los módulos importados
2. Eliminar las etiquetas <script> antiguas
3. Probar completamente la aplicación
4. Eliminar los archivos de componentes web antiguos una vez confirmada la migración
`;

  createDir(path.dirname(docsPath));
  fs.writeFileSync(docsPath, docsContent, 'utf8');
  console.log('Documentación de migración generada en docs/MIGRATION_GUIDE.md');
}

// Función principal
async function main() {
  console.log('Iniciando migración de componentes web a módulos ES6...\n');
  
  let migratedCount = 0;
  
  // Migrar cada componente
  for (const component of componentsToMigrate) {
    if (migrateComponent(component)) {
      migratedCount++;
    }
  }
  
  console.log(`\nMigración completada: ${migratedCount}/${componentsToMigrate.length} componentes migrados.`);
  
  // Generar documentación
  generateMigrationDocs();
  
  console.log('\nSiguientes pasos:');
  console.log('1. Revisar los componentes migrados en frontend/assets/js/components/');
  console.log('2. Actualizar los archivos HTML para usar los nuevos módulos');
  console.log('3. Consultar docs/MIGRATION_GUIDE.md para más detalles');
}

// Ejecutar migración
main();