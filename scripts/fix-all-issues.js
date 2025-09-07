const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Script para corregir todos los problemas comunes\n');

try {
  // 1. Corregir imágenes
  console.log('1. Corrigiendo imágenes...');
  execSync('node scripts/fix-images.js', { stdio: 'inherit' });
  
  // 2. Corregir importaciones duplicadas
  console.log('\n2. Corrigiendo importaciones duplicadas...');
  execSync('node scripts/fix-duplicate-imports.js', { stdio: 'inherit' });
  
  // 3. Verificar páginas
  console.log('\n3. Verificando páginas HTML...');
  execSync('node scripts/verify-html-pages.js', { stdio: 'inherit' });
  
  console.log('\n✅ Todos los problemas comunes han sido corregidos.');
  console.log('\n💡 Siguientes pasos:');
  console.log('   - Inicia el backend: npm run start:backend');
  console.log('   - Inicia Vite: npm run dev:vite');
  
} catch (error) {
  console.error('\n❌ Error al ejecutar el script:', error.message);
  process.exit(1);
}