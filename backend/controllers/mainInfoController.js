const { pool } = require("../db");
const logger = require("../logger");

const getMainInfo = async (req, res) => {
  const lang = req.query.lang || "ge";
  const titleColumn = lang === "en" ? "title_en" : "title_ge";
  
  logger.info(`GET /api/mainInfo - Language: ${lang}`);
  
  try {
    // Query the main_info table - match actual table structure
    const query = `SELECT id, title_ge, title_en, data FROM main_info`;
    const [rows] = await pool.execute(query);

    // Transform the data to use the appropriate language title
    const transformedRows = rows.map(row => ({
      id: row.id,
      title: row[titleColumn] || row.title_ge || row.title_en || 'No title available',
      title_ge: row.title_ge,
      title_en: row.title_en,
      data: row.data
    }));

    logger.info(`Successfully retrieved ${rows.length} main_info records for language: ${lang}`);
    logger.info(`Sample response: ${JSON.stringify(transformedRows[0] || {})}`);
    
    res.status(200).json({
      success: true,
      language: lang,
      count: transformedRows.length,
      data: transformedRows
    });
  } catch (err) {
    logger.error(`Error in getMainInfo: ${err.message}`);
    logger.error(`Query attempted: SELECT id, title_ge, title_en, data FROM main_info`);
    logger.error(`Language requested: ${lang}`);
    logger.error(err);
    res.status(500).json({ 
      error: err.message,
      details: "Failed to retrieve main_info data",
      lang: lang
    });
  }
};

module.exports = {
  getMainInfo,
};
