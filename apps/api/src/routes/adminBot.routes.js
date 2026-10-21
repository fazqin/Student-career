const express = require("express");
const router = express.Router();

const {
    handleBotMessage,
    getBotStatus,
    getBotApplicationsPreview,
} = require("../controllers/adminBot.controller");

// Route to get AI bot status & API key detection
router.get("/status", getBotStatus);

// Route to send command to the bot
router.post("/message", handleBotMessage);

// Route to get current applications for live preview
router.get("/applications", getBotApplicationsPreview);

module.exports = router;
