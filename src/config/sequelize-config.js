// sequelize-config.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración básica desde .env
const dbConfig = {
  dialect: process.env.DB_DIALECT || 'mysql',
  logging: false, // quiet mode
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // ← FIX IMPORTANTE
    }
  }
};

const connectionUrl = process.env.DB_URL;

let sequelize;

if (connectionUrl) {
  sequelize = new Sequelize(connectionUrl, dbConfig);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      ...dbConfig,
    }
  );
}

module.exports = sequelize;
