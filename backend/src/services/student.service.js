const { Enrollment, Course, Submission, AiRecommendation, User, Task } = require('../models/associations');
const { analyzeStudentPerformance } = require('../ai/analysisService');
const config = require('../config/config');

/**
 * Obtiene todos los cursos en los que el estudiante está matriculado.
 */
const getStudentCourses = async (studentId) => {
  return Enrollment.findAll({
    where: { estudianteId: studentId },
    include: [{
      model: Course,
      as: 'Curso',
      include: [{ model: User, as: 'Profesor', attributes: ['id', 'nombre', 'apellido'] }]
    }]
  });
};

/**
 * Obtiene los materiales de un curso (simulado).
 */
const getCourseMaterials = async (studentId, courseId) => {
  // Verificar que el estudiante esté matriculado en el curso
  const enrollment = await Enrollment.findOne({
    where: { estudianteId: studentId, courseId: courseId }
  });

  if (!enrollment) {
    const error = new Error('No está matriculado en este curso');
    error.status = 403;
    throw error;
  }

  // En un sistema real, aquí se obtendrían los archivos o enlaces a materiales.
  // Aquí, simulamos la estructura y obtenemos las tareas del curso.
  const tasks = await Task.findAll({ where: { courseId } });

  return {
    courseId,
    materials: [
      { type: 'Documento', title: 'Introducción al Curso', url: '/materiales/intro.pdf' },
      { type: 'Video', title: 'Clase 1: Fundamentos', url: '/materiales/video_clase1.mp4' },
      { type: 'Tareas', list: tasks }
    ]
  };
};

/**
 * Permite al estudiante entregar una tarea.
 */
const submitTask = async (studentId, taskId, archivoURL) => {
  const task = await Task.findByPk(taskId);
  if (!task) {
    const error = new Error('Tarea no encontrada');
    error.status = 404;
    throw error;
  }

  // Verificar que el estudiante esté matriculado en el curso de la tarea
  const enrollment = await Enrollment.findOne({
    where: { estudianteId: studentId, courseId: task.courseId }
  });

  if (!enrollment) {
    const error = new Error('No está matriculado en el curso de esta tarea');
    error.status = 403;
    throw error;
  }

  // Verificar si ya existe una entrega (para actualizarla)
  const existingSubmission = await Submission.findOne({
    where: { estudianteId: studentId, taskId: taskId }
  });

  if (existingSubmission) {
    existingSubmission.archivoURL = archivoURL;
    existingSubmission.fechaEntrega = new Date();
    await existingSubmission.save();
    return { message: 'Entrega actualizada exitosamente', submission: existingSubmission };
  } else {
    const newSubmission = await Submission.create({
      estudianteId: studentId,
      taskId: taskId,
      archivoURL: archivoURL,
    });
    return { message: 'Entrega realizada exitosamente', submission: newSubmission };
  }
};

/**
 * Obtiene todas las notas del estudiante.
 */
const getStudentGrades = async (studentId) => {
  return Submission.findAll({
    where: { estudianteId: studentId, nota: { [config.sequelize.Op.not]: null } },
    include: [{ model: Task, as: 'Tarea', attributes: ['titulo', 'fechaEntrega'] }]
  });
};

/**
 * Obtiene las últimas recomendaciones de IA para el estudiante.
 */
const getAiRecommendations = async (studentId) => {
  // Ejecutar el análisis de rendimiento (esto también guarda el resultado)
  const analysis = await analyzeStudentPerformance(studentId);

  // Obtener la última recomendación guardada
  const latestRecommendation = await AiRecommendation.findOne({
    where: { estudianteId: studentId },
    order: [['fecha', 'DESC']],
  });

  if (latestRecommendation) {
    try {
      latestRecommendation.recomendacion = JSON.parse(latestRecommendation.recomendacion);
    } catch (e) {
      // Ignorar error de parseo si no es JSON
    }
  }

  return {
    latestAnalysis: analysis,
    latestRecommendation: latestRecommendation
  };
};

module.exports = {
  getStudentCourses,
  getCourseMaterials,
  submitTask,
  getStudentGrades,
  getAiRecommendations,
};