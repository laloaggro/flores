const fs = require('fs');
const path = require('path');

// Crear directorio si no existe
const imagesDir = path.join(__dirname, 'frontend', 'assets', 'images', 'products');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Crear imágenes de muestra con colores diferentes
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607'];
const names = ['Ramo Elegante', 'Arreglo Especial', 'Bouquet Exclusivo', 'Centro de Mesa', 'Corona Floral'];

// Generar archivos SVG simples como imágenes de muestra
for (let i = 6; i <= 10; i++) {
  const colorIndex = (i - 6) % colors.length;
  const svgContent = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${colors[colorIndex]}" />
      <circle cx="400" cy="300" r="150" fill="white" opacity="0.7" />
      <text x="50%" y="50%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${names[colorIndex]}
      </text>
      <text x="50%" y="60%" font-family="Arial" font-size="30" fill="white" text-anchor="middle" dominant-baseline="middle">
        Producto ${i}
      </text>
    </svg>
  `;
  
  const fileName = `product_${i}.svg`;
  const filePath = path.join(imagesDir, fileName);
  
  fs.writeFileSync(filePath, svgContent.trim());
  console.log(`Imagen generada: ${fileName}`);
}

console.log('¡Todas las imágenes de muestra han sido generadas!');