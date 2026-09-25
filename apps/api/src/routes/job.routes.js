const express = require("express");
const router = express.Router();

const { 
    getAllJobs,
    getJobById, 
    postAllJob, 
    putJobById, 
    delJobById,
    patchJobById 
} = require("../controllers/jobs.controller");

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", postAllJob);
router.put("/:id", putJobById);
router.delete("/:id", delJobById),
router.patch("/:id", patchJobById)

module.exports = router;



