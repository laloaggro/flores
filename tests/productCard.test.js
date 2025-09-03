/**
 * Pruebas para el componente ProductCard
 */

// Mock de funciones y módulos
const mockProduct = {
  id: 1,
  name: 'Ramo de Rosas',
  price: 15000,
  image: '/assets/images/rosas.jpg',
  category: 'Ramos',
  discount_price: 12000,
  rating: {
    rate: 4.5,
    count: 12
  }
};

// Mock del DOM
document.body.innerHTML = `
  <div id="test-container"></div>
`;

describe('ProductCard Component', () => {
  beforeEach(() => {
    // Limpiar el contenedor antes de cada prueba
    document.getElementById('test-container').innerHTML = '';
  });

  test('debería renderizar correctamente con datos de producto', () => {
    // Crear el elemento
    const productCard = document.createElement('product-card');
    productCard.setAttribute('data-product', JSON.stringify(mockProduct));
    
    // Añadir al DOM
    document.getElementById('test-container').appendChild(productCard);
    
    // Verificar que se haya renderizado
    expect(productCard.querySelector('.product-name').textContent).toBe('Ramo de Rosas');
    expect(productCard.querySelector('.price-discount').textContent).toBe('$12.000');
  });

  test('debería mostrar el precio regular cuando no hay descuento', () => {
    const productWithoutDiscount = {...mockProduct};
    delete productWithoutDiscount.discount_price;
    
    const productCard = document.createElement('product-card');
    productCard.setAttribute('data-product', JSON.stringify(productWithoutDiscount));
    
    document.getElementById('test-container').appendChild(productCard);
    
    expect(productCard.querySelector('.price-regular').textContent).toBe('$15.000');
  });

  test('debería generar estrellas de calificación correctamente', () => {
    const productCard = document.createElement('product-card');
    productCard.setAttribute('data-product', JSON.stringify(mockProduct));
    
    document.getElementById('test-container').appendChild(productCard);
    
    const stars = productCard.querySelectorAll('.product-rating i');
    expect(stars.length).toBe(5);
    
    // Verificar que haya 4 estrellas llenas, 1 media y 0 vacías
    const fullStars = productCard.querySelectorAll('.fa-star:not(.fa-star-half-alt)');
    const halfStars = productCard.querySelectorAll('.fa-star-half-alt');
    
    expect(fullStars.length).toBe(4);
    expect(halfStars.length).toBe(1);
  });
});