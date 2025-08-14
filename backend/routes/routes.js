const express = require("express");
const router = express.Router();

// Import controllers
const { healthCheck } = require("../controllers/healthController");
const regionsController = require("../controllers/regionsController");
const regionalStatistics = require("../controllers/regionalStatisticsController");
const mainInfoController = require("../controllers/mainInfoController");
const keyIndicatorsController = require("../controllers/keyIndicatorsController");
const genderStatisticsController = require("../controllers/genderStatisticsController");

// Import validation middleware
const { validateRegionId, validateLanguage } = require("../middleware/validate");

// Health and status routes
router.get("/health", healthCheck);
router.get("/test", (req, res) => {
  res.status(200).json({ 
    success: true,
    message: "API connection successful",
    timestamp: new Date().toISOString()
  });
});

// Regions routes with validation
router.get("/regions", regionsController.getAllRegions);
router.get("/regions/:id", validateRegionId, regionsController.getRegionById);
router.get("/regions/:id/statistics", validateRegionId, regionsController.getRegionStatistics);

// Statistics routes
router.get("/statistics", regionsController.getAllStatistics);

// Regional Statistics routes
router.get("/regionStatistics", regionalStatistics.getRegionStatistics);

// Key Indicators routes
router.get("/keyIndicators", keyIndicatorsController.getKeyIndicators);

// Gender Statistics routes
router.get("/genderStatistics", validateLanguage, genderStatisticsController.getGenderStatistics);

// Main info routes with language validation
router.get("/mainInfo", validateLanguage, mainInfoController.getMainInfo);

module.exports = router;
