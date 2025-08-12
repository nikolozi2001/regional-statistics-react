const db = require("../db");
const logger = require("../logger");
const { catchAsync, AppError } = require("../middleware/errorHandler");

const getAllRegions = catchAsync(async (req, res) => {
  const query = 'SELECT * FROM regions WHERE ID > 0'; // Exclude negative IDs
  const [rows] = await db.execute(query);
  
  res.status(200).json({
    success: true,
    count: rows.length,
    data: rows
  });
});

const getRegionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const query = 'SELECT * FROM regions WHERE ID = ?';
  const [rows] = await db.execute(query, [id]);
  
  if (rows.length === 0) {
    throw new AppError(`Region with ID ${id} not found`, 404);
  }
  
  res.status(200).json({
    success: true,
    data: rows[0]
  });
});

const getRegionStatistics = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const query = 'SELECT * FROM regions WHERE ID = ?';
  const [rows] = await db.execute(query, [id]);
  
  if (rows.length === 0) {
    throw new AppError(`Region with ID ${id} not found`, 404);
  }
  
  res.status(200).json({
    success: true,
    data: rows[0]
  });
});

const getAllStatistics = catchAsync(async (req, res) => {
  const query = `
    SELECT 
      ID as region_id,
      Name as region_name_ge,
      NameEN as region_name,
      CAST(REPLACE(REPLACE(Population, ' ', ''), '.', '') AS DECIMAL(10,1)) * 1000 as population,
      CAST(REPLACE(REPLACE(Area, ' ', ''), '.', '') AS DECIMAL(10,2)) as area_sq_km,
      CAST(REPLACE(GDP, ' ', '') AS DECIMAL(10,2)) as gdp_million,
      CAST(REPLACE(UnemploymentRate, ' ', '') AS DECIMAL(5,2)) as unemployment_rate,
      CAST(REPLACE(EmploymentRate, ' ', '') AS DECIMAL(5,2)) as employment_rate,
      CAST(REPLACE(RegistredEntities, ' ', '') AS DECIMAL(10,0)) as registered_enterprises
    FROM regions 
    WHERE ID > 0 AND Population != '-' AND Area != '-'
  `;
  
  const [rows] = await db.execute(query);
  
  res.status(200).json({
    success: true,
    count: rows.length,
    data: rows
  });
});

module.exports = {
  getAllRegions,
  getRegionById,
  getRegionStatistics,
  getAllStatistics
};
