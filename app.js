// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./src/config/sequelize-config');

const app = express();

app.use(cors());
app.use(express.json());

// ==============================
// Cargar MODELOS primero
// ==============================
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Enrollment = require('./src/models/Enrollment');
const Task = require('./src/models/Task');
const Submission = require('./src/models/Submission');
const StudyLog = require('./src/models/StudyLog');
const AiRecommendation = require('./src/models/AiRecommendation');
const Material = require('./src/models/Material');

// ==============================
// Luego cargar ASOCIACIONES
// ==============================
require('./src/models/associations');

// ==============================
// Conexión a DB y sincronización por orden
// ==============================
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");

    // Crear primero las tablas padre
    await User.sync({ alter: true });
    console.log("Tabla 'Users' sincronizada.");

    // Luego crear las tablas dependientes en orden
    await Course.sync({ alter: true });
    await Enrollment.sync({ alter: true });
    await Task.sync({ alter: true });
    await Submission.sync({ alter: true });
    await StudyLog.sync({ alter: true });
    await AiRecommendation.sync({ alter: true });
    await Material.sync({ alter: true });

    console.log("Todas las tablas sincronizadas correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar con la DB:", error);
  }
}

connectDB();

// ==============================
// Rutas básicas
// ==============================
app.get('/', (req, res) => {
  res.send('Backend Lumina funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
