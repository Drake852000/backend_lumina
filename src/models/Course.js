const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  profesorId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser asignado después
    references: {
      model: 'users', // Nombre de la tabla
      key: 'id',
    },
  },
}, {
  tableName: 'Courses',
  timestamps: true,
});

module.exports = Course;