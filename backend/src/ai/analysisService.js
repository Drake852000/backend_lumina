const { Op } = require('sequelize');
const { User, Submission, StudyLog, AiRecommendation } = require('../models/associations');
const { RISK_RULES } = require('./rules');
const { generateRecommendations } = require('./recommendationEngine');

/**
 * Función principal para analizar el rendimiento de un estudiante.
 * @param {number} studentId - ID del estudiante.
 * @returns {object} Objeto con el análisis de rendimiento, riesgo y recomendaciones.
 */
async function analyzeStudentPerformance(studentId) {
  const student = await User.findByPk(studentId);
  if (!student || student.rol !== 'estudiante') {
    throw new Error('Estudiante no encontrado.');
  }

  // 1. Recopilación de datos (Simulación de datos)
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Notas promedio (simulación: promedio de las últimas 10 notas)
  const submissions = await Submission.findAll({
    where: { estudianteId: studentId, nota: { [Op.not]: null } },
    order: [['fechaEntrega', 'DESC']],
    limit: 10,
  });
  const totalNotes = submissions.reduce((sum, sub) => sum + sub.nota, 0);
  const averageGrade = submissions.length > 0 ? totalNotes / submissions.length : 20; // 20 si no hay notas

  // Entregas tardías (simulación: contar entregas donde fechaEntrega > Task.fechaEntrega)
  // Esto requiere un JOIN, pero por simplicidad de IA ligera, simularemos un conteo
  const lateSubmissionsCount = submissions.filter(sub => sub.nota < 10).length; // Usamos nota < 10 como proxy de entrega tardía/mala

  // Tiempos de estudio (minutos de estudio en la última semana)
  const studyLogs = await StudyLog.findAll({
    where: {
      estudianteId: studentId,
      fecha: { [Op.gte]: oneWeekAgo.toISOString().split('T')[0] }
    }
  });
  const studyTimePerWeek = studyLogs.reduce((sum, log) => sum + log.minutosEstudio, 0);

  // Días desde el último estudio (simulación)
  const lastStudyLog = await StudyLog.findOne({
    where: { estudianteId: studentId },
    order: [['fecha', 'DESC']],
  });
  const daysSinceLastStudy = lastStudyLog ? Math.floor((now - new Date(lastStudyLog.fecha)) / (24 * 60 * 60 * 1000)) : 100;

  // Actividad en la plataforma (simulación: días desde la última entrega)
  const lastSubmission = await Submission.findOne({
    where: { estudianteId: studentId },
    order: [['fechaEntrega', 'DESC']],
  });
  const platformInactivityDays = lastSubmission ? Math.floor((now - new Date(lastSubmission.fechaEntrega)) / (24 * 60 * 60 * 1000)) : 100;


  const studentData = {
    averageGrade,
    lateSubmissionsCount,
    studyTimePerWeek,
    daysSinceLastStudy,
    platformInactivityDays,
  };

  // 2. Aplicación de reglas y cálculo de riesgo
  let totalRisk = 0;
  let alertMessage = 'Rendimiento estable.';
  let specificRecommendation = 'Continuar con el buen trabajo.';
  let isAtRisk = false;

  for (const rule of RISK_RULES) {
    if (rule.condition(studentData)) {
      totalRisk += rule.riskLevel;
      alertMessage = rule.alert; // Sobrescribe con la alerta más reciente
      specificRecommendation = rule.recommendation;
      isAtRisk = true;
    }
  }

  // Normalizar el riesgo (simplemente limitamos a 100)
  const finalRisk = Math.min(totalRisk, 100);

  // 3. Determinación del rendimiento
  let rendimiento = 'alto';
  if (finalRisk > 70) {
    rendimiento = 'bajo';
  } else if (finalRisk > 30) {
    rendimiento = 'medio';
  }

  // 4. Generación de recomendaciones
  const recommendationResult = generateRecommendations({
    rendimiento,
    riesgo: finalRisk,
    alert: alertMessage,
    specificRecommendation,
  });

  const result = {
    rendimiento,
    riesgo: finalRisk,
    alert: alertMessage,
    recomendaciones: recommendationResult.recomendaciones,
    planEstudio: recommendationResult.planEstudio,
  };

  // 5. Guardar resultados en AiRecommendations
  await AiRecommendation.create({
    estudianteId: studentId,
    recomendacion: JSON.stringify(result), // Guardamos el objeto completo como JSON
    riesgoDetectado: isAtRisk,
  });

  return result;
}

module.exports = {
  analyzeStudentPerformance,
};