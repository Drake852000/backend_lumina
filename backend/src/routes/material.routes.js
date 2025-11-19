const express = require("express");
const router = express.Router();
const {
  createMaterial,
  getMaterials,
  getMaterialsByCourse
} = require("../controllers/material.controller");

const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const config = require("../config/config");

// 🔹 Solo los profesores pueden crear materiales
router.post(
  "/",
  requireAuth,
  requireRole([config.roles.PROFESSOR]),
  createMaterial
);

// 🔹 Listar todos los materiales (opcional)
router.get("/", requireAuth, getMaterials);

// 🔹 🔥 Ruta que el estudiante NECESITA
router.get("/:courseId", requireAuth, getMaterialsByCourse);

module.exports = router;
