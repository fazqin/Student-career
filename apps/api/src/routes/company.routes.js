const express = require("express");
const router = express.Router();

const {
    getAllCompanies,
    getCompanyById,
    postAllCompany,
    putCompanyById,
    delCompanyById,
} = require("../controllers/company.controller");

const validateCompany = require(
    "../middlewares/validation/company.validate"
);

router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.post("/", validateCompany, postAllCompany);
router.put("/:id", validateCompany, putCompanyById);
router.delete("/:id", delCompanyById);

module.exports = router;