/**
 * Reglas básicas para la detección de riesgo y generación de alertas.
 * Se basan en umbrales simples para simular un módulo de IA ligera.
 */

const RISK_RULES = [
  {
    condition: (data) => data.averageGrade < 11,
    riskLevel: 80,
    alert: (data) =>
      'Riesgo Alto: El promedio de notas es inferior a 11. Se requiere intervención inmediata.',
    recommendation:
      'Reforzar los conceptos básicos y buscar tutoría en las áreas de menor rendimiento.',
  },
  {
    condition: (data) => data.daysSinceLastStudy >= 5,
    riskLevel: 60,
    alert: (data) =>
      `Alerta de Desinterés: Han pasado ${data.daysSinceLastStudy} días sin actividad de estudio registrada.`,
    recommendation:
      'Establecer un horario de estudio regular y comenzar con sesiones cortas de repaso.',
  },
  {
    condition: (data) => data.lateSubmissionsCount >= 3,
    riskLevel: 45,
    alert: (data) =>
      `Alerta de Puntualidad: Se han registrado ${data.lateSubmissionsCount} entregas tardías.`,
    recommendation:
      'Revisar la gestión del tiempo y planificar las entregas con antelación. Considerar un plan de reforzamiento.',
  },
  {
    condition: (data) => data.platformInactivityDays >= 7,
    riskLevel: 70,
    alert: (data) =>
      `Alerta de Inactividad: El estudiante no ha accedido a la plataforma en ${data.platformInactivityDays} días.`,
    recommendation:
      'Contactar al estudiante para verificar su situación y motivar su reincorporación a la plataforma.',
  },
  {
    condition: (data) => data.studyTimePerWeek < 60,
    riskLevel: 50,
    alert: (data) =>
      `Bajo Tiempo de Estudio: Solo ${data.studyTimePerWeek} minutos de estudio registrados esta semana.`,
    recommendation:
      'Incrementar el tiempo de estudio diario a un mínimo de 30 minutos.',
  },
];

module.exports = {
  RISK_RULES,
};
