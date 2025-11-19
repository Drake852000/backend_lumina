const Material = require('../models/Material');
const Course = require('../models/Course');
const Enrollment = require("../models/Enrollment"); // 🔥 Mover arriba mejora orden

// 📌 Crear material (solo profesor)
exports.createMaterial = async (req, res) => {
  try {
    const { titulo, descripcion, archivoUrl, courseId } = req.body;
    const professorId = req.user.id; // viene del token

    // 1️⃣ Verificar que el curso pertenezca al profesor
    const course = await Course.findOne({
      where: { id: courseId, profesorId: professorId }
    });

    if (!course) {
      return res.status(403).json({
        message: "No puedes subir material a un curso que no te pertenece"
      });
    }

    // 2️⃣ Crear el material
    const material = await Material.create({
      titulo,
      descripcion,
      archivoUrl,
      courseId
    });

    res.status(201).json(material);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear material", error });
  }
};

// 📌 Listar TODOS los materiales (opcional)
exports.getMaterials = async (req, res) => {
  try {
    const materiales = await Material.findAll({
      include: [{ model: Course, as: "curso" }],
    });

    res.json(materiales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener materiales", error });
  }
};

// 📌 Obtener materiales por curso (profesor o estudiante)
exports.getMaterialsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.rol;

    // 🔹 Si es estudiante → verificar inscripción
    if (userRole === "estudiante") {
      const estaInscrito = await Enrollment.findOne({
        where: { estudianteId: userId, courseId }
      });

      if (!estaInscrito) {
        return res.status(403).json({ message: "No estás inscrito en este curso" });
      }
    }

    // 🔹 Si es profesor → validar que sea su curso
    if (userRole === "profesor") {
      const curso = await Course.findOne({
        where: { id: courseId, profesorId: userId }
      });

      if (!curso) {
        return res.status(403).json({ message: "No puedes ver materiales de un curso que no te pertenece" });
      }
    }

    // 🔹 Obtener materiales
    const materiales = await Material.findAll({
      where: { courseId },
      order: [["createdAt", "DESC"]]
    });

    res.json(materiales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener materiales", error });
  }
};
