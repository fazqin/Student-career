const express = require("express");
const router = express.Router();

const { 
    getAllJobs,
    getJobById
} = require("../controllers/jobs.controller");

router.get("/", getAllJobs);
router.get("/:id", getJobById);

// router.get("/:id", (req,res) => {
//     const jobs = ["AI Engineer", "ML Engineer", "Data Scientist"];

//     const id = parseInt(req.params.id, 10);

//     if (id >= 0 && id < jobs.length) {
//         res.json({ name: jobs[id]});
//     } else {res.status(404).json({error: "Gak nemu nih!"})
//     }
// });

module.exports = router;