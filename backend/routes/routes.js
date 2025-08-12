const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const regionsController = require("../controllers/regionsController");
const indicatorsController = require("../controllers/indicatorsController");
const indicatorsEnController = require("../controllers/indicatorsEnController");

// Root API route
router.get("/", (req, res) => {
  const readmePath = path.join(__dirname, "../README.md");
  fs.readFile(readmePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading README.md");
    } else {
      res.type("text/plain").send(data);
    }
  });
});

// Health check route (redundant but helpful)
router.get("/health", (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Regions routes
router.get("/regions/:id", regionsController.getRegionById);
router.get("/regions", regionsController.getAllRegions);
router.get("/indicators/:row", indicatorsController.getIndicatorRow);
router.get("/indicatorsEn/:row", indicatorsEnController.getIndicatorRowEn);

// Debug route to test API connection
router.get("/test", (req, res) => {
  res.status(200).json({ message: "API connection successful" });
});

module.exports = router;
