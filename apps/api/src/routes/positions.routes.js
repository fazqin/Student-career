const express = require("express");
const router = express.Router();

const { 
    getAllPositions,
    getPositionById, 
    postAllPosition, 
    putPositionById, 
    delPositionById,
    patchPositionById 
} = require("../controllers/positions.controller");

router.get("/", getAllPositions);
router.get("/:id", getPositionById);
router.post("/", postAllPosition);
router.put("/:id", putPositionById);
router.delete("/:id", delPositionById),
router.patch("/:id", patchPositionById)

module.exports = router;