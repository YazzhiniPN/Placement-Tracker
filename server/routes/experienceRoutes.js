const express = require("express");
const router = express.Router();
const {addExperience, getExperiences, getExperience, deleteExperience} = require("../controllers/experienceController");
const {verifyToken} = require("../middleware/auth");

router.post("/", verifyToken, addExperience);
router.get("/", verifyToken, getExperiences);
router.get("/:company", verifyToken, getExperience);
router.delete("/:id", verifyToken, deleteExperience);

module.exports = router;

