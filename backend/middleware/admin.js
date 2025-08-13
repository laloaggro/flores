const jwt = require('jsonwebtoken');
const db = require('../database/connection');

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    
    // Buscar usuario y verificar rol
    db.get("SELECT id, name, email, role FROM users WHERE id = ? AND role = 'admin'", [decoded.userId], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (!row) {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
      }

      // Adjuntar información del usuario a la solicitud
      req.user = {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role
      };
      
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = isAdmin;