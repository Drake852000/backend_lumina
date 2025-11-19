const rateLimit = require('express-rate-limit');

// Limitador de peticiones para rutas sensibles (como login)
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // Máximo 10 peticiones por IP por minuto
  message: {
    status: 429,
    message: 'Demasiadas solicitudes de login desde esta IP, por favor intente de nuevo después de un minuto.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware para aplicar el limitador solo a rutas específicas
const applyRateLimiting = (req, res, next) => {
  if (req.path === '/api/auth/login') {
    return loginLimiter(req, res, next);
  }
  next();
};

module.exports = {
  applyRateLimiting,
};