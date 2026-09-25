const express = require("express");
const router = express.Router();

const { getInterviewById, getAllInterviews
} = require("../controllers/interview.controller");

router.get("/", getAllInterviews)
router.get("/:id", getInterviewById)
// router.get("/:id", (req,res) => {
//     const interview = ["asoy", "ML Engineer", "Data Scientist"];

//     const id = parseInt(req.params.id, 10);

//     if (id >= 0 && id < interview.length) {
//         res.json({ name: interview[id]});
//     } else {res.status(404).json({error: "Gak nemu nih!"})
//     }
// });

module.exports = router;
