
const express = require("express");
const router = express.Router();

const {
    getAllProfiles,
    updateMyProfile
} = require("../controllers/profiles.controller");

const validateProfile = require("../middlewares/validation/profile.validate");
const { authenticateToken } = require("../middlewares/auth.middleware");

// GET semua profil
router.get("/", getAllProfiles);

// PUT profil pengguna yang sedang login
router.put(
    "/me",
    authenticateToken,
    validateProfile,
    updateMyProfile
);

module.exports = router;
