// Header.js
class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="container">
            <nav class="navbar" role="navigation" aria-label="Menú principal">
                <a href="index.html" class="logo" aria-label="Arreglos Florales Victoria - Inicio"><i class="fas fa-leaf" aria-hidden="true"></i> Arreglos Florales Victoria</a>
                
                <button class="hamburger" aria-label="Menú" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <ul class="nav-links">
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="products.html">Productos</a></li>
                    <li><a href="index.html#about">Nosotros</a></li>
                    <li><a href="index.html#contacto">Contacto</a></li>
                </ul>
                
                <div class="user-actions">
                    <a href="login.html" id="loginLink" class="btn-login" aria-label="Iniciar sesión" style="display: none;">
                        <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
                        <span>Iniciar sesión</span>
                    </a>
                    <div class="user-menu" id="userMenu" role="navigation" aria-label="Menú de usuario" style="display: none;">
                        <button class="user-info" aria-haspopup="true" aria-expanded="false">
                            <img id="userProfileImage" class="user-avatar" src="./assets/images/default-avatar.svg" alt="Avatar de usuario">
                            <span id="userNameDisplay" class="user-name"></span>
                            <i class="fas fa-caret-down" aria-hidden="true"></i>
                        </button>
                        <ul class="user-dropdown" role="menu">
                            <li><a href="profile.html" role="menuitem"><i class="fas fa-user-circle" aria-hidden="true"></i> Perfil</a></li>
                            <li><a href="orders.html" role="menuitem"><i class="fas fa-shopping-bag" aria-hidden="true"></i> Mis Pedidos</a></li>
                            <li><a href="wishlist.html" role="menuitem"><i class="fas fa-heart" aria-hidden="true"></i> Lista de Deseos</a></li>
                            <li><a href="#" id="logoutLink" role="menuitem"><i class="fas fa-sign-out-alt" aria-hidden="true"></i> Cerrar sesión</a></li>
                        </ul>
                    </div>
                    <div class="cart-icon" role="button" tabindex="0" aria-label="Carrito de compras" aria-expanded="false">
                        <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                        <span class="cart-count" id="cartCount">0</span>
                    </div>
                </div>
            </nav>
        </div>
        `;
    }
}

customElements.define('site-header', Header);