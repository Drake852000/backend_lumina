const express = require("express");
const taskController = require("../controllers/task.controller");
const submissionController = require("../controllers/submission.controller");
const progressController = require("../controllers/progress.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const { User, Course, Submission, Task } = require("../models/associations");
const config = require("../config/config");
const materialRoutes = require("./material.routes");


const router = express.Router();

// 🔐 Todas las rutas requieren ser PROFESOR
router.use(requireAuth, requireRole([config.roles.PROFESSOR]));

/* ==========================================
   CURSOS
========================================== */
router.get("/courses", async (req, res) => {
  try {
    const profesorId = req.user.id;

    const cursos = await Course.findAll({
      where: { profesorId },
      attributes: ["id", "nombre", "descripcion", "profesorId"],
    });

    res.json(cursos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener cursos" });
  }
});

router.post("/courses", async (req, res) => {
  try {
    const profesorId = req.user.id;
    const { nombre, descripcion } = req.body;

    const newCourse = await Course.create({
      nombre,
      descripcion,
      profesorId,
    });

    res.status(201).json(newCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear curso" });
  }
});

/* ==========================================
   TAREAS
========================================== */
router.get("/tasks", taskController.getTasksByProfessor);
router.post("/tasks", taskController.createTask);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

/* ==========================================
   ENTREGAS
========================================== */
router.get(
  "/tasks/:taskId/submissions",
  submissionController.getSubmissionsByTask
);
router.put("/submissions/:id/grade", submissionController.gradeSubmission);

/* ==========================================
   NOTAS
========================================== */
router.get("/grades", async (req, res) => {
  try {
    const profesorId = req.user.id;

    // Obtener cursos impartidos por este profesor
    const courses = await Course.findAll({
      where: { profesorId },
      attributes: ["id"],
    });

    const courseIds = courses.map((c) => c.id);

    if (courseIds.length === 0) {
      return res.json([]); // No hay cursos = no hay notas
    }

    // 🔹 Traer todas las entregas con estudiante, tarea y curso, filtrando solo estudiantes
    const grades = await Submission.findAll({
      include: [
        {
          model: Task,
          as: "Tarea",
          where: { courseId: courseIds },
          attributes: ["id", "titulo", "courseId"],
          include: [
            {
              model: Course,
              as: "Curso",
              attributes: ["id", "nombre"],
            },
          ],
        },
        {
          model: User,
          as: "Estudiante",
          attributes: ["id", "nombre", "apellido", "email", "rol"],
          where: { rol: "estudiante" }, // 🔹 FILTRO: solo estudiantes
        },
      ],
      attributes: ["id", "nota", "archivoURL", "fechaEntrega"],
    });

    // Formatear respuesta para frontend
    const formattedGrades = grades.map((g) => ({
      id: g.id,
      nota: g.nota,
      archivoURL: g.archivoURL,
      fechaEntrega: g.fechaEntrega,
      tarea: {
        id: g.Tarea?.id,
        titulo: g.Tarea?.titulo,
        curso: {
          id: g.Tarea?.Curso?.id,
          nombre: g.Tarea?.Curso?.nombre,
        },
      },
      estudiante: {
        id: g.Estudiante?.id,
        nombre: g.Estudiante?.nombre,
        apellido: g.Estudiante?.apellido,
        email: g.Estudiante?.email,
      },
    }));

    res.json(formattedGrades);
  } catch (err) {
    console.error("❌ Error cargando notas:", err);
    res.status(500).json({ message: "Error al obtener notas" });
  }
});

/* ==========================================
   PROGRESO & IA
========================================== */
router.get(
  "/courses/:courseId/progress",
  progressController.getCourseProgress
);
router.get("/ai/student/:studentId", progressController.consultAIModule);

/* ==========================================
   🔹 Materiales
========================================== */
router.use('/materials', materialRoutes);

module.exports = router;
