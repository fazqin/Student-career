const express = require("express");
const router = express.Router();

// const {
//     getNameById
// } = require("../controllers/name.controller");


router.get("/jobs/:id", (req,res) => {
    const jobs = ["AI Engineer", "ML Engineer", "Data Scientist"];

    const id = parseInt(req.params.id, 10);

    if (id >= 0 && id < jobs.length) {
        res.json({ name: jobs[id]});
    } else {res.status(404).json({error: "Gak nemu nih!"})
    }
});

module.exports = router;