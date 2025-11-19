const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const AiRecommendation = sequelize.define('AiRecommendation', {
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
  recomendacion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  riesgoDetectado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'AiRecommendations',
  timestamps: true,
});

module.exports = AiRecommendation;