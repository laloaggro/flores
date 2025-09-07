import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Función para obtener todas las páginas HTML del proyecto
function getHtmlPages() {
  const pages = {};
  
  // Agregar index.html del directorio raíz
  const mainIndexPath = resolve(__dirname, 'dev/index.html');
  if (fs.existsSync(mainIndexPath)) {
    pages.main = mainIndexPath;
  }
  
  // Agregar todas las páginas del directorio pages
  const pagesDir = resolve(__dirname, 'dev/pages');
  if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir)
      .filter(file => file.endsWith('.html'))
      .forEach(file => {
        const name = file.replace('.html', '');
        pages[name] = resolve(pagesDir, file);
      });
  }
  
  return pages;
}

export default defineConfig({
  // Directorio raíz del proyecto frontend
  root: './dev',

  // Directorio base para servir los archivos
  base: '/',

  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    open: true,
    host: true,
    // Proxy para las llamadas a la API del backend
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Configuración de la construcción
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'dev/index.html'),
        ...getHtmlPages()
      },
      output: {
        // Configuración de nombres de archivos con hash para cache busting
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name].[hash].[ext]';
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return 'assets/images/[name].[hash].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        }
      }
    }
  },

  // Configuración de los directorios de recursos
  publicDir: './dev/assets',
  
  // Configuración de los plugins
  plugins: [
    // Podemos agregar plugins aquí si es necesario
  ],
  
  // Configuración de resolución de alias
  resolve: {
    alias: {
      '@': resolve(__dirname, 'dev'),
      '@assets': resolve(__dirname, 'dev/assets'),
      '@components': resolve(__dirname, 'dev/components'),
      '@pages': resolve(__dirname, 'dev/pages'),
      '@utils': resolve(__dirname, 'dev/assets/js/components/utils')
    }
  },
  
  // Configuración de CSS
  css: {
    devSourcemap: true,
    // Habilitar postcss para futuras optimizaciones
    postcss: './postcss.config.js'
  }
});