const { Enrollment, User, Course } = require('../models/associations');
const config = require('../config/config');

/**
 * Obtiene todas las matrículas.
 */
const getAllEnrollments = async () => {
  return Enrollment.findAll({
    include: [
      { model: User, as: 'Estudiante', attributes: ['id', 'nombre', 'apellido', 'email'] },
      { model: Course, as: 'Curso', attributes: ['id', 'nombre'] },
    ]
  });
};

/**
 * Crea una nueva matrícula.
 */
const createEnrollment = async (estudianteId, courseId) => {
  // 1. Verificar que el estudiante exista y sea estudiante
  const student = await User.findByPk(estudianteId);
  if (!student || student.rol !== config.roles.STUDENT) {
    const error = new Error('Estudiante no encontrado o rol incorrecto');
    error.status = 400;
    throw error;
  }

  // 2. Verificar que el curso exista
  const course = await Course.findByPk(courseId);
  if (!course) {
    const error = new Error('Curso no encontrado');
    error.status = 404;
    throw error;
  }

  // 3. Verificar que no exista una matrícula previa
  const existingEnrollment = await Enrollment.findOne({
    where: { estudianteId, courseId }
  });
  if (existingEnrollment) {
    const error = new Error('El estudiante ya está matriculado en este curso');
    error.status = 409;
    throw error;
  }

  // 4. Crear la matrícula
  const enrollment = await Enrollment.create({ estudianteId, courseId });
  return enrollment;
};

/**
 * Elimina una matrícula.
 */
const deleteEnrollment = async (enrollmentId) => {
  const result = await Enrollment.destroy({ where: { id: enrollmentId } });
  if (result === 0) {
    const error = new Error('Matrícula no encontrada');
    error.status = 404;
    throw error;
  }
  return true;
};

module.exports = {
  getAllEnrollments,
  createEnrollment,
  deleteEnrollment,
};