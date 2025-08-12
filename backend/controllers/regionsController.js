const { pool } = require("../db");
const logger = require("../logger");

const getRegionById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM regions WHERE ID = ${id}`;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (err) {
    logger.error(`Error in getRegionById: ${err.message}`);
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getAllRegions = async (req, res) => {
  try {
    const query = `SELECT * FROM regions`;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (err) {
    logger.error(`Error in getAllRegions: ${err.message}`);
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRegionById,
  getAllRegions,
};
