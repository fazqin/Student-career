const express = require("express");
const router = express.Router();

const {
    getAllProfiles,
    putProfileById,
} = require("../controllers/profiles.controller");

const validateProfile = require(
    "../middlewares/validation/profile.validate"
);

// GET
router.get("/", getAllProfiles);

// PUT
router.put("/:id", validateProfile, putProfileById);

module.exports = router;