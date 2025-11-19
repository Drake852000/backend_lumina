const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/associations');
const config = require('../config/config');

/* ================================
   1. GENERAR ACCESS TOKEN
================================ */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, rol: user.rol },
    config.jwt.secret, // 👈 ESTE ES EL IMPORTANTE
    { expiresIn: config.jwt.accessExpiration }
  );
};

/* ================================
   2. GENERAR REFRESH TOKEN
================================ */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    config.jwt.refreshSecret, // 👈 ESTE TAMBIÉN
    { expiresIn: config.jwt.refreshExpiration }
  );
};

/* ================================
   3. GENERAR AMBOS TOKENS
================================ */
const generateAuthTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
  };
};

/* ================================
   4. REGISTRAR USUARIO
================================ */
const registerUser = async (data) => {
  data.password = await bcrypt.hash(data.password, 10);

  const newUser = await User.create(data);

  return {
    user: newUser,
    tokens: generateAuthTokens(newUser),
  };
};

/* ================================
   5. LOGIN USUARIO
================================ */
const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return {
    user,
    tokens: generateAuthTokens(user),
  };
};

module.exports = {
  generateAuthTokens,
  registerUser,
  loginUser,
};
