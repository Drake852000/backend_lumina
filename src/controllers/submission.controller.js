const submissionService = require('../services/submission.service');

/**
 * Obtiene todas las entregas para una tarea (Profesor).
 */
const getSubmissionsByTask = async (req, res, next) => {
  try {
    const profesorId = req.user.id;
    const submissions = await submissionService.getSubmissionsByTask(profesorId, req.params.taskId);
    res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};

/**
 * Califica una entrega (Profesor).
 */
const gradeSubmission = async (req, res, next) => {
  try {
    const profesorId = req.user.id;
    const { nota } = req.body;
    if (typeof nota !== 'number' || nota < 0 || nota > 20) {
      const error = new Error('La nota debe ser un número entre 0 y 20');
      error.status = 400;
      throw error;
    }

    const gradedSubmission = await submissionService.gradeSubmission(profesorId, req.params.id, nota);
    res.status(200).json(gradedSubmission);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubmissionsByTask,
  gradeSubmission,
};