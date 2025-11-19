require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiration: process.env.ACCESS_TOKEN_EXPIRY || '1h',
    refreshExpiration: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  },
  security: {
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutTimeMinutes: parseInt(process.env.LOCKOUT_TIME_MINUTES) || 15,
  },
  roles: {
    ADMIN: 'admin',
    PROFESSOR: 'profesor',
    STUDENT: 'estudiante',
  },
};