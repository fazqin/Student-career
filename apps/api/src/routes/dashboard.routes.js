const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboard.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

// GET /api/dashboard - retrieve real KPI and dashboard metrics
router.get("/", authenticateToken, getDashboardData);

module.exports = router;
