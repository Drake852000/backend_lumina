const { Course, User } = require('../models/associations');
const config = require('../config/config');

/**
 * Obtiene todos los cursos.
 */
const getAllCourses = async () => {
  return Course.findAll({
    include: [{ model: User, as: 'Profesor', attributes: ['id', 'nombre', 'apellido', 'email'] }]
  });
};

/**
 * Obtiene un curso por ID.
 */
const getCourseById = async (courseId) => {
  const course = await Course.findByPk(courseId, {
    include: [{ model: User, as: 'Profesor', attributes: ['id', 'nombre', 'apellido', 'email'] }]
  });
  if (!course) {
    const error = new Error('Curso no encontrado');
    error.status = 404;
    throw error;
  }
  return course;
};

/**
 * Crea un nuevo curso.
 */
const createCourse = async (courseData) => {
  return Course.create(courseData);
};

/**
 * Actualiza un curso.
 */
const updateCourse = async (courseId, updateData) => {
  const course = await Course.findByPk(courseId);
  if (!course) {
    const error = new Error('Curso no encontrado');
    error.status = 404;
    throw error;
  }

  await course.update(updateData);
  return getCourseById(courseId); // Retornar con el profesor incluido
};

/**
 * Elimina un curso.
 */
const deleteCourse = async (courseId) => {
  const result = await Course.destroy({ where: { id: courseId } });
  if (result === 0) {
    const error = new Error('Curso no encontrado');
    error.status = 404;
    throw error;
  }
  return true;
};

/**
 * Asigna un profesor a un curso.
 */
const assignProfessorToCourse = async (courseId, profesorId) => {
  const course = await Course.findByPk(courseId);
  if (!course) {
    const error = new Error('Curso no encontrado');
    error.status = 404;
    throw error;
  }

  const professor = await User.findByPk(profesorId);
  if (!professor || professor.rol !== config.roles.PROFESSOR) {
    const error = new Error('Profesor no encontrado o rol incorrecto');
    error.status = 400;
    throw error;
  }

  course.profesorId = profesorId;
  await course.save();
  return getCourseById(courseId);
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignProfessorToCourse,
};


