const express = require('express');
const cors = require('cors');
const config = require('./src/config/config');
const sequelize = require('./src/config/sequelize-config');
const { applyRateLimiting } = require('./src/middlewares/rateLimiter');

// Importar asociaciones y modelos
require('./src/models/associations');
require('./src/models/User');
require('./src/models/Course');
require('./src/models/Enrollment');
require('./src/models/Task');
require('./src/models/Submission');
require('./src/models/StudyLog');
require('./src/models/AiRecommendation');
require('./src/models/Material');

console.log("JWT SECRET:", process.env.JWT_SECRET);

const app = express();

// =====================================================
// 1. CORS (Frontend en :3001, Backend en :3000)
// =====================================================
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting global
app.use(applyRateLimiting);

// =====================================================
// 2. Rutas del backend
// =====================================================
const authRoutes = require('./src/routes/auth.routes');
const adminRoutes = require('./src/routes/admin.routes');
const professorRoutes = require('./src/routes/professor.routes');
const studentRoutes = require('./src/routes/student.routes');

const materialProfessorRoutes = require("./src/routes/material.professor.routes");
const materialStudentRoutes = require("./src/routes/material.student.routes");

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/professor', professorRoutes);
app.use('/api/student', studentRoutes);

// Rutas de materiales
app.use("/api/materials/professor", materialProfessorRoutes);
app.use("/api/materials/student", materialStudentRoutes);

// Ruta prueba
app.get('/', (req, res) => {
  res.send('Academia Backend API - Status OK');
});

// =====================================================
// 3. Manejo de errores y 404
// =====================================================
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("🔥 ERROR GLOBAL:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    error: config.env === 'development' ? err : {},
  });
});

// =====================================================
// 4. Iniciar servidor + conectar DB
// =====================================================
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    await sequelize.sync({ alter: false });
    console.log('Tablas sincronizadas correctamente.');

    app.listen(config.port, () => {
      console.log(
        `Servidor backend corriendo en http://localhost:${config.port} (modo ${config.env})`
      );
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
}

startServer();
module.exports = app;

