const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando páginas HTML del proyecto...\n');

// Directorio de páginas
const pagesDir = path.join(__dirname, '..', 'dev', 'pages');

// Lista de páginas esperadas
const expectedPages = [
  'about.html',
  'admin-orders.html',
  'admin.html',
  'cart.html',
  'checkout.html',
  'contact.html',
  'faq.html',
  'forgot-password.html',
  'index.html',
  'login.html',
  'orders.html',
  'privacy.html',
  'product-detail.html',
  'products.html',
  'profile.html',
  'register.html',
  'shipping.html',
  'sitemap.html',
  'terms.html',
  'testimonials.html',
  'wishlist.html'
];

// Verificar páginas en el directorio raíz de dev
const devRoot = path.join(__dirname, '..', 'dev');
const rootPages = ['index.html'];

// Verificar páginas en el directorio pages
console.log('📄 Páginas en el directorio raíz (dev/):');
rootPages.forEach(page => {
  const pagePath = path.join(devRoot, page);
  if (fs.existsSync(pagePath)) {
    console.log(`  ✅ ${page}`);
  } else {
    console.log(`  ❌ ${page} (no encontrada)`);
  }
});

console.log('\n📄 Páginas en el directorio pages (dev/pages/):');
const foundPages = [];
const missingPages = [];

expectedPages.forEach(page => {
  const pagePath = path.join(pagesDir, page);
  if (fs.existsSync(pagePath)) {
    console.log(`  ✅ ${page}`);
    foundPages.push(page);
  } else {
    console.log(`  ❌ ${page} (no encontrada)`);
    missingPages.push(page);
  }
});

console.log(`\n📊 Resumen:`);
console.log(`  Total de páginas esperadas: ${expectedPages.length}`);
console.log(`  Páginas encontradas: ${foundPages.length}`);
console.log(`  Páginas faltantes: ${missingPages.length}`);

if (missingPages.length > 0) {
  console.log(`\n📋 Páginas faltantes:`);
  missingPages.forEach(page => console.log(`  - ${page}`));
}

console.log('\n💡 Recomendación:');
console.log('  Actualiza vite.config.js para incluir solo las páginas que existen.');