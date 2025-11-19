const express = require('express');
const studentController = require('../controllers/student.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');
const config = require('../config/config');

const router = express.Router();

// Middleware de autorización para todas las rutas de Estudiante
router.use(requireAuth, requireRole([config.roles.STUDENT]));

// Rutas de Cursos y Materiales
router.get('/courses', studentController.getMyCourses);
router.get('/courses/:courseId/materials', studentController.getCourseMaterials);

// Rutas de Tareas y Entregas
router.post('/tasks/:taskId/submit', studentController.submitTask);

// Rutas de Notas
router.get('/grades', studentController.getMyGrades);

// Rutas de IA
router.get('/ai/recommendations', studentController.getMyAiRecommendations);

module.exports = router;