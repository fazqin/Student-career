const express = require("express");
const router = express.Router();

const { getAllProfiles
} = require("../controllers/profiles.controller");

router.get("/", getAllProfiles);

// router.get("/:id", (req,res) => {
//     const profiles = ["Yanto", "Gunawan", "Kusuma"];

//     const id = parseInt(req.params.id, 10);

//     if (id >= 0 && id < profiles.length) {
//         res.json({ name: profiles[id]});
//     } else {res.status(404).json({error: "Gak nemu nih!"})
//     }
// });

module.exports = router;