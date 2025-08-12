import Header from '../components/Header.js';
import Hero from '../components/Hero.js';
import Categories from '../components/Categories.js';
import Products from '../components/Products.js';
import About from '../components/About.js';
import Testimonials from '../components/Testimonials.js';
import Blog from '../components/Blog.js';
import Contact from '../components/Contact.js';
import Footer from '../components/Footer.js';

const Home = () => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Arreglos Victoria - Flores frescas y hermosos arreglos florales para cada ocasión especial. Entrega a domicilio en toda la Región Metropolitana.">
        <meta name="keywords" content="florería, arreglos florales, flores, regalos, entrega a domicilio, Santiago, Chile, rosas, orquídeas">
        <meta name="author" content="Arreglos Victoria">
        <title>Arreglos Victoria Florería - Flores Frescas en Santiago</title>
        <link rel="stylesheet" href="assets/css/styles.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://arreglosvictoria.cl/">
        <meta property="og:title" content="Arreglos Victoria Florería - Flores Frescas en Santiago">
        <meta property="og:description" content="Flores frescas y hermosos arreglos florales para cada ocasión especial. Entrega a domicilio en toda la Región Metropolitana.">
        <meta property="og:image" content="/api/image-proxy?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1593617133396-03503508724d%3Fixlib%3Drb-4.0.3%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D80">
        
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="https://arreglosvictoria.cl/">
        <meta property="twitter:title" content="Arreglos Victoria Florería - Flores Frescas en Santiago">
        <meta property="twitter:description" content="Flores frescas y hermosos arreglos florales para cada ocasión especial. Entrega a domicilio en toda la Región Metropolitana.">
        <meta property="twitter:image" content="/api/image-proxy?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1593617133396-03503508724d%3Fixlib%3Drb-4.0.3%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D80">
    </head>
    <body>
        ${Header()}
        ${Hero()}
        <main>
          ${Categories()}
          ${Products()}
          ${Testimonials()}
          ${About()}
          ${Blog()}
          ${Contact()}
        </main>
        ${Footer()}
        
        <script type="module">
          // Inicializar funcionalidades
          import { updateCartCount } from './assets/js/utils.js';
          import CartUtils from './assets/js/cartUtils.js';
          
          // Actualizar contador del carrito al cargar la página
          document.addEventListener('DOMContentLoaded', function() {
            updateCartCount();
            
            // Agregar efecto de desplazamiento suave para enlaces de anclaje
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
              anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                  target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              });
            });
            
            // Animaciones al desplazarse
            const observerOptions = {
              root: null,
              rootMargin: '0px',
              threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('fade-in');
                }
              });
            }, observerOptions);
            
            // Observar elementos para animaciones
            document.querySelectorAll('.product-card, .category-card, .gallery-item').forEach(el => {
              observer.observe(el);
            });
          });
        </script>
    </body>
    </html>
  `;
};

export default Home;