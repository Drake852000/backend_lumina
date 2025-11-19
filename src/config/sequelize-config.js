const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  dialect: process.env.DB_DIALECT || process.env.DB_DIALECT || 'mysql',
  logging: false,
};

// Soporte para URL de conexión completa (ej: provided by Railway)
const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || null;

let sequelize;
if (connectionUrl) {
  sequelize = new Sequelize(connectionUrl, {
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
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
    }
  );
}

module.exports = sequelize;
