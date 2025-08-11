// Header.js - Componente de encabezado
const Header = () => {
  return `
    <header>
        <div class="container">
            <nav class="navbar" role="navigation" aria-label="Menú principal">
                <a href="#home" class="logo"><i class="fas fa-leaf" aria-hidden="true"></i> Arreglos Victoria</a>
                <ul class="nav-links">
                    <li><a href="#home">Inicio</a></li>
                    <li><a href="#products">Productos</a></li>
                    <li><a href="#about">Nosotros</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                </ul>
                <div class="cart-icon" role="button" tabindex="0" aria-label="Carrito de compras">
                    <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                    <span class="cart-count">0</span>
                </div>
                <div class="user-menu" id="userMenu" style="display: none;">
                    <div class="user-info" id="userInfo">
                        <i class="fas fa-user"></i>
                        <span id="userName">Usuario</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="user-dropdown">
                        <a href="/profile.html"><i class="fas fa-user-circle"></i> Mi Perfil</a>
                        <a href="/profile.html#orders"><i class="fas fa-shopping-bag"></i> Mis Pedidos</a>
                        <a href="#" id="logoutLink"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
                    </div>
                </div>
                <a href="/login.html" class="login-link" id="loginLink" style="display: block;">Iniciar Sesión</a>
            </nav>
        </div>
    </header>
  `;
};

export default Header;