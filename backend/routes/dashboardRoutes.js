const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
} = require("../controllers/dashboardController");

// Admin only (add auth middleware if needed later)
router.get("/stats", getDashboardStats);

module.exports = router;
