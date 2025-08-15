const pool = require("../db");
const logger = require("../logger");
const { catchAsync, AppError } = require("../middleware/errorHandler");

const getAllMunicipalities = catchAsync(async (req, res) => {
  const lang = req.query.lang || "ge";

  // Select all fields, but alias the name based on language
  const nameField = lang === "en" ? "NameEN" : "Name";

  const query = `
    SELECT 
      ID,
      ${nameField} as name,
      Name as nameGe,
      NameEN as nameEn,
      Area,
      NumberOfCT,
      Villages,
      Population,
      LiveBirths,
      GeneralBirthRate,
      Dead,
      GeneralMortalityRate,
      NaturalIncrease,
      Employees,
      AVGSalary,
      RegEcSub,
      ActEcSub,
      NewlyEcEnt
    FROM municipalities 
    WHERE ID > 0
    ORDER BY ${nameField}
  `;

  const [rows] = await pool.execute(query);

  logger.info(`Retrieved ${rows.length} municipalities in ${lang}`);

  res.status(200).json({
    success: true,
    count: rows.length,
    data: rows,
  });
});

module.exports = {
  getAllMunicipalities,
};
