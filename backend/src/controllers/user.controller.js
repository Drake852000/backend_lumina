const userService = require('../services/user.service');
const config = require('../config/config');

/**
 * Obtiene todos los usuarios (Admin).
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un usuario por ID (Admin).
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo usuario (Admin).
 */
const createUser = async (req, res, next) => {
  try {
    // Asegurar que el rol sea válido
    if (!Object.values(config.roles).includes(req.body.rol)) {
      const error = new Error('Rol inválido');
      error.status = 400;
      throw error;
    }
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
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
 * Actualiza un usuario (Admin).
 */
const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un usuario (Admin).
 */
const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};