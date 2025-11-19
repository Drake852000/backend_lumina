const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const StudyLog = sequelize.define('StudyLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  estudianteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  minutosEstudio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY, // Solo la fecha, para agrupar logs diarios
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'StudyLogs',
  timestamps: true,
});

module.exports = StudyLog;