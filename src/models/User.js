const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');  // FIX
const config = require('../config/config');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase());
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM(config.roles.ADMIN, config.roles.PROFESSOR, config.roles.STUDENT),
    allowNull: false,
    defaultValue: config.roles.STUDENT,
  },
  intentosFallidos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  cuentaBloqueadaHasta: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Users',
  timestamps: true,
});

module.exports = User;
