const express = require("express");
const router = express.Router();

const { getNameById
} = require("../controllers/name.controller");

router.get("/names/:id", getNameById)

/* ini contoh route langsung logic di routenya */
// router.get("/names/:id", (req,res) => {
//     const names = ["Faza", "Abdul", "steve"];

//     const id = parseInt(req.params.id, 10);

//     if (id >= 0 && id < names.length) {
//         res.json({ name: names[id]});
//     } else {res.status(404).json({error: "Name not Found"})
//     }
// });

module.exports = router;