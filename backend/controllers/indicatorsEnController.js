const { pool } = require("../db");
const logger = require("../logger");

const getIndicatorRowEn = async (req, res) => {
  const { row } = req.params;
  try {
    const query = `SELECT ${row} FROM regional_statistics_en`;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (err) {
    logger.error(`Error in getIndicatorRowEn: ${err.message}`);
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getIndicatorRowEn,
};
