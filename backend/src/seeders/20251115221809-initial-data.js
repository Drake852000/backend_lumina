'use strict';

const bcrypt = require('bcryptjs');
const config = require('../config/config');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Crear Admin Inicial
    const hashedPassword = await bcrypt.hash('AdminPass123!', 10);
    await queryInterface.bulkInsert('Users', [{
      nombre: 'Super',
      apellido: 'Admin',
      email: 'admin@academia.com',
      password: hashedPassword,
      rol: config.roles.ADMIN,
      intentosFallidos: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // 2. Crear Profesor de Ejemplo
    const professorPassword = await bcrypt.hash('ProfesorPass123!', 10);
    await queryInterface.bulkInsert('Users', [{
      nombre: 'Ana',
      apellido: 'García',
      email: 'ana.garcia@academia.com',
      password: professorPassword,
      rol: config.roles.PROFESSOR,
      intentosFallidos: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // 3. Crear Estudiante de Ejemplo
    const studentPassword = await bcrypt.hash('EstudiantePass123!', 10);
    await queryInterface.bulkInsert('Users', [{
      nombre: 'Carlos',
      apellido: 'Pérez',
      email: 'carlos.perez@academia.com',
      password: studentPassword,
      rol: config.roles.STUDENT,
      intentosFallidos: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Obtener IDs para relaciones
    const professorUser = await queryInterface.sequelize.query(
      `SELECT id from Users WHERE email = 'ana.garcia@academia.com'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const studentUser = await queryInterface.sequelize.query(
      `SELECT id from Users WHERE email = 'carlos.perez@academia.com'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const professorId = professorUser[0].id;
    const studentId = studentUser[0].id;

    // 4. Crear Curso de Ejemplo
    await queryInterface.bulkInsert('Courses', [{
      nombre: 'Introducción a Node.js',
      descripcion: 'Curso básico para aprender a desarrollar backend con Node.js y Express.',
      profesorId,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    const course = await queryInterface.sequelize.query(
      `SELECT id from Courses WHERE nombre = 'Introducción a Node.js'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const courseId = course[0].id;

    // 5. Crear Matrícula de Ejemplo
    await queryInterface.bulkInsert('Enrollments', [{
      estudianteId: studentId,
      courseId,
      fecha: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // 6. Crear Tarea de Ejemplo
    await queryInterface.bulkInsert('Tasks', [{
      courseId,
      titulo: 'Primer Proyecto: API REST',
      descripcion: 'Implementar una API REST simple con un endpoint GET.',
      fechaEntrega: new Date(new Date().setDate(new Date().getDate() + 7)),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    const task = await queryInterface.sequelize.query(
      `SELECT id from Tasks WHERE titulo = 'Primer Proyecto: API REST'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const taskId = task[0].id;

    // 7. Crear Entrega de Ejemplo (sin calificar)
    await queryInterface.bulkInsert('Submissions', [{
      taskId,
      estudianteId: studentId,
      archivoURL: 'https://github.com/carlos/api-rest-node',
      nota: null,
      fechaEntrega: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // 8. Crear Log de Estudio de Ejemplo
    await queryInterface.bulkInsert('StudyLogs', [{
      estudianteId: studentId,
      minutosEstudio: 60,
      fecha: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('AiRecommendations', null, {});
    await queryInterface.bulkDelete('StudyLogs', null, {});
    await queryInterface.bulkDelete('Submissions', null, {});
    await queryInterface.bulkDelete('Tasks', null, {});
    await queryInterface.bulkDelete('Enrollments', null, {});
    await queryInterface.bulkDelete('Courses', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};