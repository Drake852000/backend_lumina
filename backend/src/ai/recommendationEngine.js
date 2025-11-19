/**
 * Motor de generación de recomendaciones personalizadas basado en el rendimiento.
 */

const generateRecommendations = (performanceData) => {
  const recommendations = [];

  // Recomendaciones basadas en el nivel de rendimiento
  switch (performanceData.rendimiento) {
    case 'alto':
      recommendations.push('Felicidades por tu alto rendimiento. Considera tomar cursos avanzados o participar como mentor.');
      recommendations.push('Actividad sugerida: Explora temas de profundización relacionados con tus cursos actuales.');
      break;
    case 'medio':
      recommendations.push('Tu rendimiento es bueno, pero hay margen de mejora. Enfócate en las áreas donde tienes notas más bajas.');
      recommendations.push('Actividad sugerida: Dedica 15 minutos extra al día a repasar los temas más difíciles.');
      break;
    case 'bajo':
      recommendations.push('Hemos detectado un bajo rendimiento. Es crucial que busques ayuda y revises tus hábitos de estudio.');
      recommendations.push('Actividad sugerida: Agenda una tutoría con tu profesor y realiza el plan de estudio básico sugerido.');
      break;
  }

  // Recomendaciones basadas en el riesgo detectado por las reglas
  if (performanceData.riesgo > 0) {
    recommendations.push(`Alerta de riesgo (${performanceData.riesgo}%): ${performanceData.alert}`);
    recommendations.push(`Recomendación específica: ${performanceData.specificRecommendation}`);
  }

  // Plan de estudio básico (simulación)
  const planEstudio = {
    lunes: 'Repaso de la semana anterior (30 min)',
    martes: 'Estudio de nuevo material (60 min)',
    miercoles: 'Práctica de ejercicios (45 min)',
    jueves: 'Estudio de nuevo material (60 min)',
    viernes: 'Repaso general y preparación de tareas (90 min)',
  };

  return {
    recomendaciones,
    planEstudio,
  };
};

module.exports = {
  generateRecommendations,
};