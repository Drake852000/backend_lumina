const reportService = require('../services/report.service');

/**
 * Reporte: Cursos con más actividad.
 */
const getMostActiveCourses = async (req, res, next) => {
  try {
    const courses = await reportService.getMostActiveCourses();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

/**
 * Reporte: Estudiantes con mejor rendimiento.
 */
const getTopPerformingStudents = async (req, res, next) => {
  try {
    const students = await reportService.getTopPerformingStudents();
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

/**
 * Reporte: Estudiantes en riesgo (IA).
 */
const getAtRiskStudents = async (req, res, next) => {
  try {
    const students = await reportService.getAtRiskStudents();
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMostActiveCourses,
  getTopPerformingStudents,
  getAtRiskStudents,
};