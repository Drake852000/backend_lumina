const express = require('express');
const userController = require('../controllers/user.controller');
const courseController = require('../controllers/course.controller');
const enrollmentController = require('../controllers/enrollment.controller');
const reportController = require('../controllers/report.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');
const config = require('../config/config');

const router = express.Router();

// Middleware de autorización para todas las rutas de Admin
router.use(requireAuth, requireRole([config.roles.ADMIN]));

// Rutas CRUD de Usuarios
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser); // El admin puede crear cualquier rol
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Rutas CRUD de Cursos
router.get('/courses', courseController.getAllCourses);
router.get('/courses/:id', courseController.getCourseById);
router.post('/courses', courseController.createCourse);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);

// Asignar profesor a curso
router.put('/courses/:id/assign-professor', courseController.assignProfessor);

// Rutas CRUD de Matrículas
router.get('/enrollments', enrollmentController.getAllEnrollments);
router.post('/enrollments', enrollmentController.createEnrollment);
router.delete('/enrollments/:id', enrollmentController.deleteEnrollment);

// Rutas de Reportes
router.get('/reports/active-courses', reportController.getMostActiveCourses);
router.get('/reports/top-students', reportController.getTopPerformingStudents);
router.get('/reports/at-risk-students', reportController.getAtRiskStudents);

module.exports = router;