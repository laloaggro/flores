// Middleware para verificar si el usuario es administrador
const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
    }
    
    // Verificar si el formato es "Bearer <token>"
    const tokenParts = authHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
      return res.status(401).json({ error: 'Formato de token inválido.' });
    }
    
    const token = tokenParts[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_por_defecto');
    
    // Verificar si el usuario es administrador
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    
    // Agregar el usuario decodificado al request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado.' });
    }
    console.error('Error en middleware de administrador:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = isAdmin;