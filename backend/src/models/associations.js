const { sequelize } = require('../config/sequelize-config');

const User = require('./User');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Task = require('./Task');
const Submission = require('./Submission');
const StudyLog = require('./StudyLog');
const AiRecommendation = require('./AiRecommendation');

/* ================================
   1. USER ASSOCIATIONS
================================ */

// Un profesor imparte varios cursos
User.hasMany(Course, { foreignKey: 'profesorId', as: 'CursosImpartidos' });
Course.belongsTo(User, { foreignKey: 'profesorId', as: 'Profesor' });

// Un estudiante tiene varias matrículas
User.hasMany(Enrollment, { foreignKey: 'estudianteId', as: 'Matriculas' });
Enrollment.belongsTo(User, { foreignKey: 'estudianteId', as: 'Estudiante' });

// Acceso directo a los cursos de un estudiante a través de Enrollment
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'estudianteId',
  otherKey: 'courseId',
  as: 'Cursos',
});
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: 'courseId',
  otherKey: 'estudianteId',
  as: 'Estudiantes',
});

// Un estudiante tiene varias entregas
User.hasMany(Submission, { foreignKey: 'estudianteId', as: 'Entregas' });
Submission.belongsTo(User, { foreignKey: 'estudianteId', as: 'Estudiante' });

// Un estudiante tiene varios logs de estudio
User.hasMany(StudyLog, { foreignKey: 'estudianteId', as: 'LogsEstudio' });
StudyLog.belongsTo(User, { foreignKey: 'estudianteId', as: 'Estudiante' });

// Un estudiante tiene varias recomendaciones IA
User.hasMany(AiRecommendation, { foreignKey: 'estudianteId', as: 'RecomendacionesIA' });
AiRecommendation.belongsTo(User, { foreignKey: 'estudianteId', as: 'Estudiante' });


/* ================================
   2. COURSE ASSOCIATIONS
================================ */

// Un curso tiene varias matrículas
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'Matriculas' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'Curso' });

// Un curso tiene varias tareas
Course.hasMany(Task, { foreignKey: 'courseId', as: 'Tareas' });
Task.belongsTo(Course, { foreignKey: 'courseId', as: 'Curso' });


/* ================================
   3. TASK ASSOCIATIONS
================================ */

// Una tarea tiene varias entregas
Task.hasMany(Submission, { foreignKey: 'taskId', as: 'Entregas' });
Submission.belongsTo(Task, { foreignKey: 'taskId', as: 'Tarea' });


/* ================================
   EXPORTAR MODELOS Y SEQUELIZE
================================ */
module.exports = {
  sequelize,
  User,
  Course,
  Enrollment,
  Task,
  Submission,
  StudyLog,
  AiRecommendation,
};