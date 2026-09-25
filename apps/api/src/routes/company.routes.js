const express = require("express");
const router = express.Router();

const {
    getAllCompanies,
    getCompanyById
} = require("../controllers/company.controller");

// GET semua company
// /api/companies
router.get("/", getAllCompanies);

// GET company berdasarkan id
// /api/companies/:id
router.get("/:id", getCompanyById);

module.exports = router;