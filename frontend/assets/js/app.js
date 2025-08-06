// Simulación del carrito de compras
let cart = [];
let cartCount = 0;

// Función para cargar el carrito desde localStorage
function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('arreglosVictoriaCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        }
    } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error);
        cart = [];
        cartCount = 0;
    }
}

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage() {
    try {
        localStorage.setItem('arreglosVictoriaCart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error al guardar el carrito en localStorage:', error);
    }
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Función para agregar un producto al carrito
function addToCart(id, name, price) {
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    cartCount++;
    updateCartCount();
    saveCartToLocalStorage();
    
    // Mostrar mensaje de confirmación
    alert(`${name} agregado al carrito!`);
}

// Función para manejar el envío del formulario de contacto
function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // En un entorno real, aquí se enviaría la información a un servidor
    alert(`Gracias ${name}! Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.\n\nDetalles del mensaje:\nEmail: ${email}\nTeléfono: ${phone}\nMensaje: ${message}`);
    
    // Limpiar el formulario
    document.getElementById('contactForm').reset();
}

// Función para inicializar los event listeners
function initializeEventListeners() {
    // Event listeners para los botones "Agregar al carrito"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            addToCart(id, name, price);
        });
    });
    
    // Event listener para el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    initializeEventListeners();
    updateCartCount();
    
    // Smooth scrolling para enlaces de navegación
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
});