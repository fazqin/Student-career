const express = require("express");

const router = express.Router();


const companies = [
    {
        id: 1,
        name: "Telkom Indonesia",
        industry: "Telecommunication",
        location: "Bandung",
        website: "https://telkom.co.id"
    },
    {
        id: 2,
        name: "Tokopedia",
        industry: "Technology",
        location: "Jakarta",
        website: "https://tokopedia.com"
    }
];


// GET semua perusahaan
// Endpoint: GET /api/companies
router.get("/companies", (req, res) => {

    res.json(companies);

});


// GET perusahaan berdasarkan ID
// Endpoint: GET /api/companies/:id
router.get("/companies/:id", (req, res) => {

    const id = parseInt(req.params.id, 10);

    const company = companies.find((item) => item.id === id);


    if (company) {

        res.json(company);

    } else {

        res.status(404).json({
            error: "Company Not Found"
        });

    }

});


module.exports = router;