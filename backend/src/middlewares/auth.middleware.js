const jwt = require('jsonwebtoken');
const { User } = require('../models/associations');
const config = require('../config/config');

/**
 * Middleware para verificar el token de acceso (requireAuth).
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Acceso denegado. Token no proporcionado.');
      error.status = 401;
      throw error;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      const error = new Error('Token inválido. Usuario no encontrado.');
      error.status = 401;
      throw error;
    }

    // Adjuntar el usuario y su rol a la solicitud
    req.user = user.toJSON();
    req.user.rol = user.rol; // Asegurar que el rol esté disponible
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      error.message = 'Token expirado.';
      error.status = 401;
    } else if (error.name === 'JsonWebTokenError') {
      error.message = 'Token inválido.';
      error.status = 401;
    } else {
      error.status = error.status || 500;
    }
    next(error);
  }
};

/**
 * Middleware para verificar el rol del usuario (requireRole).
 * @param {Array<string>} allowedRoles - Roles permitidos para acceder a la ruta.
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      // Esto no debería pasar si requireAuth se ejecuta primero
      const error = new Error('Error de autenticación. Rol no definido.');
      error.status = 403;
      return next(error);
    }

    if (!allowedRoles.includes(req.user.rol)) {
      const error = new Error('Acceso denegado. No tiene el rol requerido.');
      error.status = 403;
      return next(error);
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};