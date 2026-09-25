const express = require("express");
const router = express.Router();

const {
    getAllCompanies,
    getCompanyById, postAllCompany
} = require("../controllers/company.controller");

// GET semua company
// /api/companies
router.get("/", getAllCompanies);

// GET company berdasarkan id
// /api/companies/:id
router.get("/:id", getCompanyById);

// POST company
// /api/companies
router.post("/", postAllCompany);

module.exports = router;