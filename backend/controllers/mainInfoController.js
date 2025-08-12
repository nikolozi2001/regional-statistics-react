const db = require("../db");
const logger = require("../logger");
const { catchAsync, AppError } = require("../middleware/errorHandler");

const getMainInfo = catchAsync(async (req, res) => {
  const lang = req.query.lang || "ge";
  const titleColumn = lang === "en" ? "title_en" : "title_ge";
  
  logger.info(`GET /api/mainInfo - Language: ${lang}`);
  
  // Query the main_info table - match actual table structure
  const query = `SELECT id, title_ge, title_en, data, tooltip_ge, tooltip_en FROM main_info`;
  const [rows] = await db.execute(query);

  if (!rows || rows.length === 0) {
    throw new AppError('No main info data found', 404);
  }

  // Transform the data to use the appropriate language title
  const transformedRows = rows.map(row => ({
    id: row.id,
    title: row[titleColumn] || row.title_ge || row.title_en || 'No title available',
    title_ge: row.title_ge,
    title_en: row.title_en,
    data: row.data,
    tooltip_ge: row.tooltip_ge,
    tooltip_en: row.tooltip_en
  }));

  logger.info(`Successfully retrieved ${rows.length} main_info records for language: ${lang}`);
  
  res.status(200).json({
    success: true,
    language: lang,
    count: transformedRows.length,
    data: transformedRows
  });
});

module.exports = {
  getMainInfo,
};
