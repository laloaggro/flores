// Modelo de Producto
class Product {
  constructor(id, name, price, description, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
  }

  // Método para validar los datos del producto
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('El nombre del producto es requerido');
    }
    
    if (!this.price || this.price <= 0) {
      errors.push('El precio debe ser un número positivo');
    }
    
    if (!this.description || this.description.trim() === '') {
      errors.push('La descripción del producto es requerida');
    }
    
    return errors;
  }
}

module.exports = Product;