const express = require("express");
const router = express.Router();
const {
    subscribeTier,
    getCurrentSubscription,
    getTransactionHistory,
} = require("../controllers/subscription.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

// Semua endpoint subscription membutuhkan login (JWT token)
router.post("/subscribe", authenticateToken, subscribeTier);
router.get("/current", authenticateToken, getCurrentSubscription);
router.get("/history", authenticateToken, getTransactionHistory);

module.exports = router;
