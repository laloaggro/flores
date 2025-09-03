// web-components.config.js
// Configuración para manejar componentes web personalizados

export default {
  // Componentes web que deben ser copiados al directorio de distribución
  webComponents: [
    'components/Header.js',
    'components/Footer.js',
    'components/Testimonials.js',
    'components/product/Products.js',
    'components/product/ProductCard.js',
    'components/cart/CartItem.js'
  ],
  
  // Directorio de salida para los componentes web
  outputDir: 'dist/components',
  
  // Directorio de entrada para los componentes web
  inputDir: 'frontend/components',
  
  // Configuración de optimización
  optimization: {
    minify: true,
    compress: true
  }
};