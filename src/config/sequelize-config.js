const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de conexión desde .env
const dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: process.env.DB_DIALECT || 'mysql',
  logging: false,
};

// Soporte para URL completa de Railway (opcional)
const connectionUrl = process.env.DATABASE_URL || null;

let sequelize;
if (connectionUrl) {
  sequelize = new Sequelize(connectionUrl, {
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: { ssl: { rejectUnauthorized: true } },
  });
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
      dialectOptions: { ssl: { rejectUnauthorized: true } },
    }
  );
}

module.exports = sequelize;
