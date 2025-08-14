const pool = require("../db");
const logger = require("../logger");
const { catchAsync, AppError } = require("../middleware/errorHandler");

const getKeyIndicators = catchAsync(async (req, res) => {
  const lang = req.query.lang || "ge";
  const table = lang === "en" ? "key_indicators_en" : "key_indicators";

  logger.info(`GET /api/keyIndicators - Language: ${lang}`);

  // Query the regions table for actual regional statistics data
  const query = `
    SELECT ID, keyIndicators, dataContent from ${table}
  `;

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
  getKeyIndicators,
};
