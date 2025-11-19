const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');
const Course = require('./Course');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  archivoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Courses',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'Materials',
  timestamps: true,
});

Course.hasMany(Material, { foreignKey: 'courseId', as: 'materiales' });
Material.belongsTo(Course, { foreignKey: 'courseId', as: 'curso' });

module.exports = Material;
