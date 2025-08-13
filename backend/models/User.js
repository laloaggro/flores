class User {
  constructor(id, name, email, password, role = 'user') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // 'user' o 'admin'
  }

  // Verificar si el usuario es administrador
  isAdmin() {
    return this.role === 'admin';
  }

  // Convertir a objeto plano (sin password)
  toObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role
    };
  }
}

module.exports = User;