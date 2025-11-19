const progressService = require('../services/progress.service');
const { analyzeStudentPerformance } = require('../ai/analysisService');

/**
 * Obtiene el progreso de todos los estudiantes en un curso (Profesor).
 */
const getCourseProgress = async (req, res, next) => {
  try {
    const profesorId = req.user.id;
    const progress = await progressService.getCourseProgress(profesorId, req.params.courseId);
    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

/**
 * Consulta el módulo de IA para un estudiante específico (Profesor).
 */
const consultAIModule = async (req, res, next) => {
  try {
    // Nota: En un sistema real, el profesor solo podría consultar estudiantes de sus cursos.
    // Por simplicidad, aquí solo verificamos que el usuario sea profesor.
    const studentId = req.params.studentId;
    const analysis = await analyzeStudentPerformance(studentId);
    res.status(200).json(analysis);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourseProgress,
  consultAIModule,
};