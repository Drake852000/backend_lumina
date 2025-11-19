const studentService = require('../services/student.service');

/**
 * Obtiene los cursos del estudiante.
 */
const getMyCourses = async (req, res, next) => {
  try {
    const courses = await studentService.getStudentCourses(req.user.id);
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los materiales de un curso.
 */
const getCourseMaterials = async (req, res, next) => {
  try {
    const materials = await studentService.getCourseMaterials(req.user.id, req.params.courseId);
    res.status(200).json(materials);
  } catch (error) {
    next(error);
  }
};

/**
 * Entrega una tarea.
 */
const submitTask = async (req, res, next) => {
  try {
    const { archivoURL } = req.body;
    if (!archivoURL) {
      const error = new Error('archivoURL es obligatorio');
      error.status = 400;
      throw error;
    }
    const result = await studentService.submitTask(req.user.id, req.params.taskId, archivoURL);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene las notas del estudiante.
 */
const getMyGrades = async (req, res, next) => {
  try {
    const grades = await studentService.getStudentGrades(req.user.id);
    res.status(200).json(grades);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene las recomendaciones de IA.
 */
const getMyAiRecommendations = async (req, res, next) => {
  try {
    const recommendations = await studentService.getAiRecommendations(req.user.id);
    res.status(200).json(recommendations);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCourses,
  getCourseMaterials,
  submitTask,
  getMyGrades,
  getMyAiRecommendations,
};