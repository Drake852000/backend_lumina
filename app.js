require('dotenv').config();

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

const app = express();

// =======================
// CORS
// =======================
const allowedOrigins = ['http://localhost:3001', 'https://mi-frontend.vercel.app'];
app.use(cors({
  origin: function(origin, callback) {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS no permitido'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(applyRateLimiting);

// =======================
// Rutas
// =======================
const authRoutes = require('./src/routes/auth.routes');
const adminRoutes = require('./src/routes/admin.routes');
const professorRoutes = require('./src/routes/professor.routes');
const studentRoutes = require('./src/routes/student.routes');
const materialProfessorRoutes = require('./src/routes/material.professor.routes');
const materialStudentRoutes = require('./src/routes/material.student.routes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/professor', professorRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/materials/professor', materialProfessorRoutes);
app.use('/api/materials/student', materialStudentRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Academia Backend API - Status OK');
});

// Endpoint para probar conexión DB
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: 'Conexión a DB OK ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Error en DB ❌', error: err.message });
  }
});

// =======================
// Manejo de errores
// =======================
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR GLOBAL:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    error: config.env === 'development' ? err : {},
  });
});

// =======================
// Iniciar servidor + DB con retry
// =======================
async function startServer(retries = 10, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('Conexión a la base de datos establecida correctamente.');
      await sequelize.sync({ alter: false });
      console.log('Tablas sincronizadas correctamente.');

      app.listen(config.port, () => {
        console.log(`Servidor backend corriendo en http://localhost:${config.port} (modo ${config.env})`);
      });

      return; // todo listo, salimos del loop
    } catch (error) {
      console.error(`❌ No se pudo conectar a la base de datos. Intento ${i + 1} de ${retries}`);
      console.error(error.message);
      if (i < retries - 1) {
        console.log(`Reintentando en ${delay / 1000} segundos...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('💀 No se pudo conectar a la base de datos después de varios intentos.');
        process.exit(1);
      }
    }
  }
}

startServer();

module.exports = app;
