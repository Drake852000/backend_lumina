const { body, validationResult } = require('express-validator');
const { User } = require('../models/associations');
const config = require('../config/config');

/**
 * Middleware para manejar los resultados de la validación.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Validación profesional de contraseña.
 */
const passwordValidation = body('password')
  .isLength({ min: 8, max: 50 }).withMessage('La contraseña debe tener entre 8 y 50 caracteres.')
  .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos 1 mayúscula (A-Z).')
  .matches(/[a-z]/).withMessage('La contraseña debe incluir al menos 1 minúscula (a-z).')
  .matches(/[0-9]/).withMessage('La contraseña debe incluir al menos 1 número.')
  .matches(/[!@#$%^&*()_\-+=<>?{}\[\]~.]/).withMessage('La contraseña debe incluir al menos 1 símbolo especial: !@#$%^&*()_-+=<>?{}[]~.');

/**
 * Middleware de validación para el registro.
 */
const validateRegister = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio.'),
  body('email')
    .isEmail().withMessage('El email debe tener un formato válido.')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value.toLowerCase() } });
      if (user) {
        return Promise.reject('El email ya está registrado.');
      }
    }),
  passwordValidation,
  body('rol').optional().isIn(Object.values(config.roles)).withMessage('Rol inválido.'),
  handleValidationErrors,
];

/**
 * Middleware de validación para el login.
 */
const validateLogin = [
  body('email').isEmail().withMessage('Email inválido.'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
  handleValidationErrors,
];

/**
 * Middleware de validación para el reseteo de contraseña.
 */
const validateResetPassword = [
  body('token').notEmpty().withMessage('El token es obligatorio.'),
  body('newPassword').custom((value, { req }) => {
    // Reutilizar la validación de contraseña
    const result = passwordValidation.run(req);
    return result.then(() => true);
  }),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateResetPassword,
};