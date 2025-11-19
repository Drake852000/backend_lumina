const { User } = require('../models/associations');
const authService = require('./auth.service');
const config = require('../config/config');

/**
 * Obtiene todos los usuarios.
 */
const getAllUsers = async () => {
  return User.findAll({
    attributes: { exclude: ['password', 'intentosFallidos', 'cuentaBloqueadaHasta'] }
  });
};

/**
 * Obtiene un usuario por ID.
 */
const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password', 'intentosFallidos', 'cuentaBloqueadaHasta'] }
  });
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }
  return user;
};

/**
 * Crea un nuevo usuario (solo Admin puede crear otros roles).
 */
const createUser = async (userData) => {
  // El servicio de registro ya maneja el hash de contraseña
  const newUser = await authService.registerUser(userData);
  return newUser;
};

/**
 * Actualiza un usuario.
 */
const updateUser = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  // No permitir cambiar la contraseña directamente por esta ruta
  if (updateData.password) {
    delete updateData.password;
  }

  // No permitir cambiar el email si ya existe otro usuario con ese email
  if (updateData.email && updateData.email.toLowerCase() !== user.email) {
    const existingUser = await User.findOne({ where: { email: updateData.email.toLowerCase() } });
    if (existingUser) {
      const error = new Error('El email ya está en uso');
      error.status = 409;
      throw error;
    }
  }

  await user.update(updateData);
  
  const userObject = user.toJSON();
  delete userObject.password;
  delete userObject.intentosFallidos;
  delete userObject.cuentaBloqueadaHasta;
  return userObject;
};

/**
 * Elimina un usuario.
 */
const deleteUser = async (userId) => {
  const result = await User.destroy({ where: { id: userId } });
  if (result === 0) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }
  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};