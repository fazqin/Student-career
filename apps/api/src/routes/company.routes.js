const express = require("express");
const router = express.Router();

const {
    getAllCompanies,
    getCompanyById,
    postAllCompany,
    putCompanyById,
    delCompanyById,
} = require("../controllers/company.controller");

router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.post("/", postAllCompany);
router.put("/:id", putCompanyById);
router.delete("/:id", delCompanyById);

module.exports = router;