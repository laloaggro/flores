// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './frontend',
  base: '/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'frontend/index.html'),
        about: resolve(__dirname, 'frontend/about.html'),
        contact: resolve(__dirname, 'frontend/contact.html'),
        products: resolve(__dirname, 'frontend/products.html'),
        'product-detail': resolve(__dirname, 'frontend/product-detail.html'),
        cart: resolve(__dirname, 'frontend/cart.html'),
        checkout: resolve(__dirname, 'frontend/checkout.html'),
        login: resolve(__dirname, 'frontend/login.html'),
        register: resolve(__dirname, 'frontend/register.html'),
        'forgot-password': resolve(__dirname, 'frontend/forgot-password.html'),
        profile: resolve(__dirname, 'frontend/profile.html'),
        orders: resolve(__dirname, 'frontend/orders.html'),
        wishlist: resolve(__dirname, 'frontend/wishlist.html'),
        admin: resolve(__dirname, 'frontend/admin.html'),
        'admin-orders': resolve(__dirname, 'frontend/admin-orders.html'),
        faq: resolve(__dirname, 'frontend/faq.html'),
        privacy: resolve(__dirname, 'frontend/privacy.html'),
        terms: resolve(__dirname, 'frontend/terms.html'),
        shipping: resolve(__dirname, 'frontend/shipping.html'),
        sitemap: resolve(__dirname, 'frontend/sitemap.html'),
        testimonials: resolve(__dirname, 'frontend/testimonials.html'),
      },
      // Resolver módulos externos
      external: [
        // Excluir módulos que no se pueden resolver
      ]
    },
    // Configurar resolución de módulos
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'frontend'),
      '@components': resolve(__dirname, 'frontend/components'),
      '@assets': resolve(__dirname, 'frontend/assets'),
      '@js': resolve(__dirname, 'frontend/assets/js'),
      // Alias para resolver correctamente los componentes web
      'components': resolve(__dirname, 'frontend/components'),
      '@utils': resolve(__dirname, 'frontend/assets/js/components/utils'),
      '@ui': resolve(__dirname, 'frontend/assets/js/components/ui'),
      '@product': resolve(__dirname, 'frontend/assets/js/components/product'),
      '@cart': resolve(__dirname, 'frontend/assets/js/components/cart'),
      '@pages': resolve(__dirname, 'frontend/assets/js/components/pages'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  // Configuración para manejar assets
  publicDir: resolve(__dirname, 'frontend/assets'),
});