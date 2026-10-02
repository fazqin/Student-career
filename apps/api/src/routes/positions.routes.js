const express = require("express");
const router = express.Router();

const { 
    getAllPositions,
    getPositionById,
    postAllPosition,
    putPositionById,
    delPositionById,
    //patchPositionById,
} = require("../controllers/positions.controller");

// const checkPositions = require("../middlewares/checkPositions")

const validatePosition = require("../middlewares/validation/position.validate")

//GET
router.get("/", getAllPositions);
router.get("/:id", getPositionById);

//POST
router.post("/", validatePosition, postAllPosition);

//PUT
router.put("/:id", validatePosition, putPositionById);

//DELETE
router.delete("/:id", delPositionById);

// //PATCH
// router.patch("/:id", patchPositionById)

module.exports = router;