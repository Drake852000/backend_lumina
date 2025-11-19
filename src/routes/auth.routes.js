const express = require('express');
const authController = require('../controllers/auth.controller');
const {
  validateRegister,
  validateLogin,
  validateResetPassword,
} = require('../middlewares/validation.middleware');

const router = express.Router();

// POST /api/auth/register - Registro de usuario (Estudiante por defecto)
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login - Inicio de sesión
router.post('/login', validateLogin, authController.login);

// POST /api/auth/refresh - Refrescar tokens
router.post('/refresh', authController.refresh);

// POST /api/auth/forgot-password - Solicitud de recuperación de contraseña
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password - Reseteo de contraseña
router.post('/reset-password', validateResetPassword, authController.resetPassword);

module.exports = router;