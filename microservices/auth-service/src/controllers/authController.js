const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, printf } = format;

// Configurar el formato del log (única declaración)
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Crear el logger
const logger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/auth-service.log' })
  ]
});

const { generateToken } = require('../utils/jwt');
const { comparePassword, hashPassword } = require('../utils/bcrypt');
const db = require('../config/database');

/**
 * Controlador de autenticación
 */
class AuthController {
  constructor() {
    this.db = db;
  }

  /**
   * Registrar un nuevo usuario
   * @param {object} req - Solicitud Express
   * @param {object} res - Respuesta Express
   */
  register = async (req, res) => {
    try {
      logger.info('Solicitud de registro recibida:', req.body);
      const { name, email, password } = req.body;

      // Validar datos requeridos
      if (!name || !email || !password) {
        logger.warn('Datos faltantes en solicitud de registro');
        return res.status(400).json({
          status: 'fail',
          message: 'Nombre, email y contraseña son requeridos'
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await this.db.get('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser) {
        return res.status(409).json({
          status: 'fail',
          message: 'El usuario ya existe'
        });
      }

      // Hashear contraseña
      const hashedPassword = await hashPassword(password);

      // Insertar nuevo usuario
      const result = await this.db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      // Generar token
      const token = generateToken({ id: result.lastID, email });

      res.status(201).json({
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: {
          user: {
            id: result.lastID,
            name,
            email
          },
          token
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Iniciar sesión
   * @param {object} req - Solicitud Express
   * @param {object} res - Respuesta Express
   */
  login = async (req, res) => {
    try {
      logger.info('Solicitud de login recibida:', req.body);
      const { email, password } = req.body;

      // Validar datos requeridos
      if (!email || !password) {
        logger.warn('Email o contraseña faltantes en solicitud de login');
        return res.status(400).json({
          status: 'fail',
          message: 'Email y contraseña son requeridos'
        });
      }

      // Buscar usuario
      const user = await this.db.get('SELECT * FROM users WHERE email = ?', [email]);
      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'fail',
          message: 'Credenciales inválidas'
        });
      }

      // Generar token
      const token = generateToken({ id: user.id, email });

      res.status(200).json({
        status: 'success',
        message: 'Inicio de sesión exitoso',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          token
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Verificar token
   * @param {object} req - Solicitud Express
   * @param {object} res - Respuesta Express
   */
  async verifyToken(req, res) {
    try {
      logger.info('Solicitud de verificación de token recibida');
      res.status(200).json({
        status: 'success',
        message: 'Token válido',
        data: {
          user: req.user
        }
      });
    } catch (error) {
      logger.error('Error en verificación de token:', { error: error.message });
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = AuthController;