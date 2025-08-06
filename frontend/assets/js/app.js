// Simulación del carrito de compras
let cart = [];
let cartCount = 0;

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
    
    // Mostrar mensaje de confirmación
    alert(`${name} agregado al carrito!`);
}

// Función para manejar el envío del formulario de contacto
function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    alert(`Gracias ${name}! Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.`);
    
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