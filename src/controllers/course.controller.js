const courseService = require('../services/course.service');

/**
 * Obtiene todos los cursos.
 */
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un curso por ID.
 */
const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo curso (Admin).
 */
const createCourse = async (req, res, next) => {
  try {
    const newCourse = await courseService.createCourse(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un curso (Admin).
 */
const updateCourse = async (req, res, next) => {
  try {
    const updatedCourse = await courseService.updateCourse(req.params.id, req.body);
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un curso (Admin).
 */
const deleteCourse = async (req, res, next) => {
  try {
    await courseService.deleteCourse(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Asigna profesor a curso (Admin).
 */
const assignProfessor = async (req, res, next) => {
  try {
    const { profesorId } = req.body;
    const updatedCourse = await courseService.assignProfessorToCourse(req.params.id, profesorId);
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignProfessor,
};