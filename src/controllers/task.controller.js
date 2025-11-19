const { Task, Course } = require('../models/associations');
const config = require('../config/config');

/**
 * Verifica si el usuario es el profesor del curso.
 */
const isProfessorOfCourse = async (profesorId, courseId) => {
  const course = await Course.findByPk(courseId);
  if (!course || course.profesorId !== profesorId) {
    const error = new Error('Acceso denegado. No es el profesor de este curso.');
    error.status = 403;
    throw error;
  }
  return course;
};

/**
 * Crea una nueva tarea.
 */
const createTask = async (req, res) => {
  try {
    const profesorId = req.user.id;
    const taskData = req.body;

    await isProfessorOfCourse(profesorId, taskData.courseId);

    const task = await Task.create(taskData);
    res.json(task);
  } catch (err) {
    console.error("❌ Error createTask:", err);
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

/**
 * OBTENER TODAS LAS TAREAS DEL PROFESOR (FUNCIÓN QUE FALTABA 🔥)
 */
const getTasksByProfessor = async (req, res) => {
  try {
    const profesorId = req.user.id;

    // Buscar cursos del profesor
    const courses = await Course.findAll({
      where: { profesorId },
      attributes: ['id'],
    });

    const courseIds = courses.map(c => c.id);

    // Si no tiene cursos, retornar lista vacía
    if (courseIds.length === 0) {
      return res.json([]);
    }

    // TAREAS de esos cursos
    const tasks = await Task.findAll({
      where: { courseId: courseIds },
      order: [['createdAt', 'DESC']],
    });

    res.json(tasks); // 👈 **IMPORTANTE: devolver SOLO el array**
  } catch (err) {
    console.error("❌ Error getTasksByProfessor:", err);
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

/**
 * Obtiene tareas por curso.
 */
const getTasksByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const tasks = await Task.findAll({ where: { courseId } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tareas del curso' });
  }
};

/**
 * Actualiza una tarea.
 */
const updateTask = async (req, res) => {
  try {
    const profesorId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    await isProfessorOfCourse(profesorId, task.courseId);

    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
};

/**
 * Elimina una tarea.
 */
const deleteTask = async (req, res) => {
  try {
    const profesorId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    await isProfessorOfCourse(profesorId, task.courseId);

    await Task.destroy({ where: { id: taskId } });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};

module.exports = {
  createTask,
  getTasksByProfessor,   // 👈 YA EXISTE
  getTasksByCourse,
  updateTask,
  deleteTask,
};
