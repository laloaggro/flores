class Header extends HTMLElement {
    /**
     * Se ejecuta cuando el elemento se conecta al DOM
     * Renderiza el contenido del encabezado
     */
    connectedCallback() {
        this.innerHTML = `
            <header>
                <div class="navbar">
                    <div class="logo">
                        <a href="index.html" aria-label="Arreglos Florales Victoria - Inicio">
                            <img src="assets/images/logo.png" alt="Logo de Arreglos Florales Victoria" width="80" height="80">
                        </a>
                    </div>
                    
                    <nav>
                        <ul class="nav-links">
                            <li><a href="index.html" class="nav-link" data-page="home">Inicio</a></li>
                            <li><a href="products.html" class="nav-link" data-page="products">Productos</a></li>
                            <li><a href="about.html" class="nav-link" data-page="about">Nosotros</a></li>
                            <li><a href="contact.html" class="nav-link" data-page="contact">Contacto</a></li>
                        </ul>
                    </nav>
                    
                    <div class="nav-icons">
                        <button id="theme-toggle" class="nav-icon" aria-label="Cambiar tema">
                            <i class="fas fa-moon"></i>
                        </button>
                        
                        <a href="cart.html" id="cart-icon" class="nav-icon" aria-label="Carrito de compras">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count">0</span>
                        </a>
                        
                        <div class="user-menu">
                            <button class="user-info nav-icon" aria-haspopup="true" aria-expanded="false">
                                <img id="userProfileImage" src="" alt="Foto de perfil" style="display: none; width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                                <i class="fas fa-user"></i>
                            </button>
                            <ul class="user-dropdown">
                                <li><a href="profile.html"><i class="fas fa-user-circle"></i> Perfil</a></li>
                                <li><a href="orders.html"><i class="fas fa-box"></i> Mis Pedidos</a></li>
                                <li><a href="wishlist.html"><i class="fas fa-heart"></i> Lista de Deseos</a></li>
                                <li><a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a></li>
                            </ul>
                        </div>
                        
                        <a href="login.html" id="login-link" class="nav-icon" aria-label="Iniciar sesión" style="display: none;">
                            <i class="fas fa-sign-in-alt"></i>
                        </a>
                    </div>
                </div>
            </header>
        `;
        
        // Configurar la interactividad después de renderizar
        setTimeout(() => {
            this.setupInteractivity();
        }, 0);
    }
    
    /**
     * Configura la interactividad del header
     */
    setupInteractivity() {
        // Toggle de tema
        const themeToggle = this.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                // Cambiar el icono
                const themeIcon = themeToggle.querySelector('i');
                if (themeIcon) {
                    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
            });
        }
        
        // Dropdown de usuario
        const userInfo = this.querySelector('.user-info');
        const userDropdown = this.querySelector('.user-dropdown');
        
        if (userInfo && userDropdown) {
            userInfo.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = userInfo.getAttribute('aria-expanded') === 'true';
                userInfo.setAttribute('aria-expanded', !isExpanded);
                userDropdown.classList.toggle('show');
            });
            
            // Cerrar el dropdown al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!userInfo.contains(e.target)) {
                    userInfo.setAttribute('aria-expanded', 'false');
                    userDropdown.classList.remove('show');
                }
            });
            
            // Cerrar el dropdown al presionar Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    userInfo.setAttribute('aria-expanded', 'false');
                    userDropdown.classList.remove('show');
                }
            });
        }
        
        // Configurar cierre de sesión
        const logoutLink = this.querySelector('#logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            });
        }
    }
}

// Registrar el componente personalizado para que pueda ser usado en el HTML
customElements.define('site-header', Header);

export default Header;