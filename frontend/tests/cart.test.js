// Pruebas automatizadas para el carrito de compras
describe('Carrito de Compras', () => {
    beforeEach(() => {
        // Limpiar el carrito antes de cada prueba
        localStorage.removeItem('cart');
    });

    test('debería agregar un producto al carrito', () => {
        const product = {
            id: 1,
            name: 'Ramo de Rosas',
            price: 15990,
            image: 'ramo-rosas.jpg'
        };

        addToCart(product, 2);
        
        const cart = JSON.parse(localStorage.getItem('cart'));
        expect(cart).toHaveLength(1);
        expect(cart[0].id).toBe(1);
        expect(cart[0].quantity).toBe(2);
    });

    test('debería incrementar la cantidad si el producto ya existe en el carrito', () => {
        const product = {
            id: 1,
            name: 'Ramo de Rosas',
            price: 15990,
            image: 'ramo-rosas.jpg'
        };

        addToCart(product, 1);
        addToCart(product, 2);
        
        const cart = JSON.parse(localStorage.getItem('cart'));
        expect(cart).toHaveLength(1);
        expect(cart[0].quantity).toBe(3);
    });

    test('debería calcular correctamente el total del carrito', () => {
        const products = [
            {
                id: 1,
                name: 'Ramo de Rosas',
                price: 15990,
                image: 'ramo-rosas.jpg',
                quantity: 2
            },
            {
                id: 2,
                name: 'Arreglo Floral',
                price: 24990,
                image: 'arreglo-floral.jpg',
                quantity: 1
            }
        ];

        localStorage.setItem('cart', JSON.stringify(products));
        
        const total = calculateCartTotal();
        expect(total).toBe(56970); // (15990 * 2) + (24990 * 1)
    });

    test('debería eliminar un producto del carrito', () => {
        const products = [
            {
                id: 1,
                name: 'Ramo de Rosas',
                price: 15990,
                image: 'ramo-rosas.jpg',
                quantity: 2
            },
            {
                id: 2,
                name: 'Arreglo Floral',
                price: 24990,
                image: 'arreglo-floral.jpg',
                quantity: 1
            }
        ];

        localStorage.setItem('cart', JSON.stringify(products));
        
        removeFromCart(1);
        
        const cart = JSON.parse(localStorage.getItem('cart'));
        expect(cart).toHaveLength(1);
        expect(cart[0].id).toBe(2);
    });
});