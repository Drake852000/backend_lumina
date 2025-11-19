const { Submission, Enrollment, User, Course, StudyLog } = require('../models/associations');
const { Op } = require('sequelize');
const { isProfessorOfCourse } = require('./task.service');

/**
 * Obtiene el progreso de todos los estudiantes en un curso.
 */
const getCourseProgress = async (profesorId, courseId) => {
  // 1. Verificar que el profesor sea el dueño del curso
  await isProfessorOfCourse(profesorId, courseId);

  // 2. Obtener todos los estudiantes matriculados en el curso
  const enrollments = await Enrollment.findAll({
    where: { courseId },
    include: [{
      model: User,
      as: 'Estudiante',
      attributes: ['id', 'nombre', 'apellido', 'email']
    }]
  });

  const studentProgress = await Promise.all(enrollments.map(async (enrollment) => {
    const studentId = enrollment.estudianteId;

    // 3. Calcular el promedio de notas del estudiante en este curso
    const submissions = await Submission.findAll({
      where: {
        estudianteId: studentId,
        '$Tarea.courseId$': courseId,
        nota: { [Op.not]: null }
      },
      include: [{ model: sequelize.models.Task, as: 'Tarea', attributes: ['courseId'] }]
    });

    const totalNotes = submissions.reduce((sum, sub) => sum + sub.nota, 0);
    const averageGrade = submissions.length > 0 ? totalNotes / submissions.length : 0;

    // 4. Calcular el tiempo de estudio total (simulación)
    const totalStudyTime = await StudyLog.sum('minutosEstudio', {
      where: { estudianteId: studentId }
    });

    return {
      estudiante: enrollment.Estudiante,
      promedioNotas: parseFloat(averageGrade.toFixed(2)),
      totalTareasEntregadas: submissions.length,
      totalMinutosEstudio: totalStudyTime || 0,
    };
  }));

  return studentProgress;
};

module.exports = {
  getCourseProgress,
};