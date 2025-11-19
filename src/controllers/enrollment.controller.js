const enrollmentService = require('../services/enrollment.service');

/**
 * Obtiene todas las matrículas (Admin).
 */
const getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea una nueva matrícula (Admin).
 */
const createEnrollment = async (req, res, next) => {
  try {
    const { estudianteId, courseId } = req.body;
    const newEnrollment = await enrollmentService.createEnrollment(estudianteId, courseId);
    res.status(201).json(newEnrollment);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina una matrícula (Admin).
 */
const deleteEnrollment = async (req, res, next) => {
  try {
    await enrollmentService.deleteEnrollment(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEnrollments,
  createEnrollment,
  deleteEnrollment,
};