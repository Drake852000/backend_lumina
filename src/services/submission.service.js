const { Submission, Task, User } = require('../models/associations');
const { isProfessorOfCourse } = require('./task.service');

/**
 * Obtiene todas las entregas para una tarea específica.
 */
const getSubmissionsByTask = async (profesorId, taskId) => {
  const task = await Task.findByPk(taskId);
  if (!task) {
    const error = new Error('Tarea no encontrada');
    error.status = 404;
    throw error;
  }

  // Verificar que el profesor sea el dueño del curso
  await isProfessorOfCourse(profesorId, task.courseId);

  return Submission.findAll({
    where: { taskId },
    include: [{ model: User, as: 'Estudiante', attributes: ['id', 'nombre', 'apellido', 'email'] }]
  });
};

/**
 * Califica una entrega.
 */
const gradeSubmission = async (profesorId, submissionId, nota) => {
  const submission = await Submission.findByPk(submissionId, {
    include: [{ model: Task, as: 'Tarea' }]
  });

  if (!submission) {
    const error = new Error('Entrega no encontrada');
    error.status = 404;
    throw error;
  }

  // Verificar que el profesor sea el dueño del curso de la tarea
  await isProfessorOfCourse(profesorId, submission.Tarea.courseId);

  submission.nota = nota;
  await submission.save();
  return submission;
};

module.exports = {
  getSubmissionsByTask,
  gradeSubmission,
};