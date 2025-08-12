const express = require("express");
const router = express.Router();

// Import controllers
const regionsController = require("../controllers/regionsController");
const indicatorsController = require("../controllers/indicatorsController");
const indicatorsEnController = require("../controllers/indicatorsEnController");
const mainInfoController = require("../controllers/mainInfoController");
const { healthCheck } = require("../controllers/healthController");

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

// Indicators routes
router.get("/indicators/:row", indicatorsController.getIndicatorRow);
router.get("/indicatorsEn/:row", indicatorsEnController.getIndicatorRowEn);

// Main info routes with language validation
router.get("/mainInfo", validateLanguage, mainInfoController.getMainInfo);

module.exports = router;
