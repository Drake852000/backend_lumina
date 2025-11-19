const { Course, Enrollment, Submission, AiRecommendation, sequelize } = require('../models/associations');
const { Op } = require('sequelize');

/**
 * Reporte: Cursos con más actividad (basado en número de matrículas).
 */
const getMostActiveCourses = async () => {
  const activeCourses = await Course.findAll({
    attributes: [
      'id',
      'nombre',
      [sequelize.fn('COUNT', sequelize.col('Matriculas.id')), 'totalMatriculas']
    ],
    include: [{
      model: Enrollment,
      as: 'Matriculas',
      attributes: [],
      duplicating: false,
    }],
    group: ['Course.id', 'Course.nombre'],
    order: [[sequelize.literal('totalMatriculas'), 'DESC']],
    limit: 10,
  });

  return activeCourses;
};

/**
 * Reporte: Estudiantes con mejor rendimiento (basado en promedio de notas).
 */
const getTopPerformingStudents = async () => {
  const topStudents = await Submission.findAll({
    attributes: [
      'estudianteId',
      [sequelize.fn('AVG', sequelize.col('nota')), 'promedioNotas']
    ],
    where: {
      nota: { [Op.not]: null }
    },
    include: [{
      model: sequelize.models.User,
      as: 'Estudiante',
      attributes: ['nombre', 'apellido', 'email'],
    }],
    group: ['estudianteId', 'Estudiante.id'],
    order: [[sequelize.literal('promedioNotas'), 'DESC']],
    limit: 10,
  });

  return topStudents;
};

/**
 * Reporte: Estudiantes en riesgo (basado en AiRecommendations).
 */
const getAtRiskStudents = async () => {
  const atRiskStudents = await AiRecommendation.findAll({
    where: {
      riesgoDetectado: true
    },
    include: [{
      model: sequelize.models.User,
      as: 'Estudiante',
      attributes: ['nombre', 'apellido', 'email'],
    }],
    order: [['fecha', 'DESC']],
  });

  // Procesar las recomendaciones para hacerlas más legibles
  return atRiskStudents.map(rec => {
    const recommendation = rec.toJSON();
    try {
      recommendation.analisis = JSON.parse(recommendation.recomendacion);
    } catch (e) {
      recommendation.analisis = { error: 'Error al parsear JSON de recomendación' };
    }
    delete recommendation.recomendacion;
    return recommendation;
  });
};

module.exports = {
  getMostActiveCourses,
  getTopPerformingStudents,
  getAtRiskStudents,
};