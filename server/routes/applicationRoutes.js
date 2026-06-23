const express = require("express");
const router = express.Router();
const {addApplication, getApplications, getApplication, updateApplication, deleteApplication, getRounds, addRound, updateRound, deleteRound}  = require("../controllers/applicationController");
const {verifyToken} = require("../middleware/auth");

router.post("/", verifyToken,addApplication);
router.get("/", verifyToken, getApplications);
router.get("/:id", verifyToken, getApplication);
router.put("/:id", verifyToken, updateApplication);
router.delete("/:id", verifyToken, deleteApplication);
router.get("/:id/rounds", verifyToken, getRounds);
router.post("/:id/rounds", verifyToken, addRound);
router.put("/:id/rounds/:roundNo", verifyToken, updateRound);
router.delete("/:id/rounds/:roundNo",verifyToken, deleteRound);

module.exports = router;
