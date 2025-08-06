// Modelo de Orden
class Order {
  constructor(id, customerName, customerEmail, products, totalAmount, status = 'pending') {
    this.id = id;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.products = products; // Array de productos
    this.totalAmount = totalAmount;
    this.orderDate = new Date();
    this.status = status;
  }

  // Método para validar los datos de la orden
  validate() {
    const errors = [];
    
    if (!this.customerName || this.customerName.trim() === '') {
      errors.push('El nombre del cliente es requerido');
    }
    
    if (!this.customerEmail || this.customerEmail.trim() === '') {
      errors.push('El email del cliente es requerido');
    } else if (!this.isValidEmail(this.customerEmail)) {
      errors.push('El email del cliente no es válido');
    }
    
    if (!this.products || this.products.length === 0) {
      errors.push('Debe haber al menos un producto en la orden');
    }
    
    if (!this.totalAmount || this.totalAmount <= 0) {
      errors.push('El monto total debe ser un número positivo');
    }
    
    return errors;
  }

  // Método para validar el formato del email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para actualizar el estado de la orden
  updateStatus(newStatus) {
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (validStatuses.includes(newStatus)) {
      this.status = newStatus;
      return true;
    }
    return false;
  }
}

module.exports = Order;