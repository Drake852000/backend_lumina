const express = require("express");
const router = express.Router();
const { createMaterial, getMaterials } = require("../controllers/material.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const config = require("../config/config");

// SOLO PROFESORES
router.use(requireAuth, requireRole([config.roles.PROFESSOR]));

// Crear material
router.post("/", createMaterial);

// Listar materiales del profesor
router.get("/", getMaterials);

module.exports = router;
