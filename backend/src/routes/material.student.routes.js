const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const Material = require("../models/Material");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const config = require("../config/config");

// SOLO ESTUDIANTES
router.use(requireAuth, requireRole([config.roles.STUDENT]));

// Obtener materiales de un curso
router.get("/:courseId", async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    // validar que está matriculado
    const enrolled = await Enrollment.findOne({
      where: { estudianteId: studentId, courseId }
    });

    if (!enrolled) {
      return res.status(403).json({ message: "No estás matriculado en este curso" });
    }

    // traer materiales del curso
    const materiales = await Material.findAll({
      where: { courseId },
      include: [{ model: Course, as: "curso" }]
    });

    res.json(materiales);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener materiales" });
  }
});

module.exports = router;
