const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tasks',
      key: 'id',
    },
  },
  estudianteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  archivoURL: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  nota: {
    type: DataTypes.FLOAT,
    allowNull: true, // Puede ser null si aún no ha sido calificado
  },
  fechaEntrega: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Submissions',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['taskId', 'estudianteId']
    }
  ]
});

module.exports = Submission;