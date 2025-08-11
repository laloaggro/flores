// About.js - Componente de sección sobre nosotros
const About = () => {
  return `
    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">Sobre Nosotros</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>Somos una florería familiar con más de 10 años de experiencia en el mercado. Nos especializamos en arreglos florales únicos y personalizados para todas las ocasiones.</p>
                    <p>En Arreglos Florales Victoria, nos enorgullece ofrecer:</p>
                    <ul>
                        <li><i class="fas fa-check-circle"></i> Flores frescas de la mejor calidad</li>
                        <li><i class="fas fa-check-circle"></i> Diseños únicos y personalizados</li>
                        <li><i class="fas fa-check-circle"></i> Entrega a domicilio en toda la Región Metropolitana</li>
                        <li><i class="fas fa-check-circle"></i> Atención personalizada y profesional</li>
                    </ul>
                </div>
                <div class="about-image">
                    <img src="/api/image-proxy?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1597221335472-6f87484f8b8a%3Fixlib%3Drb-4.0.3%26auto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D400%26q%3D80" alt="Floristería Arreglos Victoria">
                </div>
            </div>
        </div>
    </section>
  `;
};

export default About;