const express = require("express");
const router = express.Router();

const {
    getAllCompanies,
    getCompanyById
} = require("../controllers/company.controller");

// GET semua company
// /api/companies
router.get("/companies", getAllCompanies);

// GET company berdasarkan id
// /api/companies/:id
router.get("/companies/:id", getCompanyById);

module.exports = router;