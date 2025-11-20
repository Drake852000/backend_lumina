const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const Enrollment = sequelize.define('Enrollment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  estudianteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // 👈 coincide con tableName del modelo User
      key: 'id',
    },
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Courses', // 👈 coincide con tableName del modelo Course
      key: 'id',
    },
  },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'Enrollments',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['estudianteId', 'courseId'] }
  ]
});

module.exports = Enrollment;
