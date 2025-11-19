const authService = require('../services/auth.service');
const config = require('../config/config');

/**
 * Maneja el registro de un nuevo usuario.
 */
const register = async (req, res, next) => {
  try {
    const { rol } = req.body;
    // Asegurar que solo el admin pueda registrar otros roles que no sean estudiante
    if (rol && rol !== config.roles.STUDENT) {
      // En un sistema real, esto debería ser manejado por un middleware de autorización
      // Por simplicidad, aquí forzamos el rol a estudiante si no hay un admin logueado
      // Pero para el registro inicial, solo permitimos estudiante.
      // El admin será creado por seed.
      req.body.rol = config.roles.STUDENT;
    }

    const user = await authService.registerUser(req.body);
    const { accessToken, refreshToken } = authService.generateAuthTokens(user);

    res.status(201).json({
      message: 'Registro exitoso',
      user,
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    // Manejar error de email duplicado de Sequelize
    if (error.name === 'SequelizeUniqueConstraintError') {
      error.status = 409;
      error.message = 'El email ya está registrado.';
    }
    next(error);
  }
};

/**
 * Maneja el login de un usuario.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.loginUser(email, password);

    res.status(200).json({
      message: 'Login exitoso',
      user,
      tokens,
    });
  } catch (error) {
    error.status = 401; // Unauthorized
    next(error);
  }
};

/**
 * Maneja el refresco de tokens.
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      const error = new Error('Refresh Token es requerido');
      error.status = 400;
      throw error;
    }

    const tokens = await authService.refreshAuthTokens(refreshToken);

    res.status(200).json({
      message: 'Tokens refrescados exitosamente',
      tokens,
    });
  } catch (error) {
    error.status = 401; // Unauthorized
    next(error);
  }
};

/**
 * Maneja la solicitud de recuperación de contraseña.
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetToken = await authService.generatePasswordResetToken(email);

    // En un sistema real, se enviaría un email.
    // Aquí, por simplicidad, retornamos el token (SOLO PARA PRUEBAS).
    res.status(200).json({
      message: 'Si el email está registrado, se ha enviado un enlace de recuperación.',
      // Nota: En producción, NUNCA se debe retornar el token en la respuesta.
      resetToken: config.env === 'development' ? resetToken : undefined,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Maneja el reseteo de contraseña.
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      const error = new Error('Token y nueva contraseña son requeridos');
      error.status = 400;
      throw error;
    }

    await authService.resetPassword(token, newPassword);

    res.status(200).json({
      message: 'Contraseña actualizada exitosamente.',
    });
  } catch (error) {
    error.status = 400; // Bad Request
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
};