const mysql = require("mysql2/promise");
require("dotenv-safe").config({
  allowEmptyValues: true
});
const logger = require("./logger");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create MySQL connection pool
const pool = mysql.createPool(config);

// Test connection
pool.getConnection()
  .then(connection => {
    logger.info("Connected to MySQL");
    connection.release();
    return pool;
  })
  .catch((err) => {
    logger.error("Database Connection Failed! Bad Config: ", err);
    logger.error("Error details: ", err.message);
    logger.error("Stack trace: ", err.stack);
  });

module.exports = {
  pool
};
