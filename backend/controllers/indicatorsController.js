const pool = require("../db");
const logger = require("../logger");
const { catchAsync, AppError } = require("../middleware/errorHandler");

const getRegionStatistics = catchAsync(async (req, res) => {
  const lang = req.query.lang || "ge";
  const table =
    lang === "en" ? "regional_statistics_en" : "regional_statistics";

  logger.info(`GET /api/indicators - Language: ${lang}`);

  // Query the regional_statistics table - get all fields
  const query = `SELECT * FROM ${table}`;
  const [rows] = await pool.execute(query);

  if (!rows || rows.length === 0) {
    throw new AppError("No regional statistics data found", 404);
  }

  logger.info(
    `Successfully retrieved ${rows.length} regional statistics records for language: ${lang}`
  );

  res.status(200).json({
    success: true,
    language: lang,
    count: rows.length,
    data: rows,
  });
});

module.exports = {
  getRegionStatistics,
};
