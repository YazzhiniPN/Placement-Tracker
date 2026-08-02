const express = require("express");
const router = express.Router();
const {personalStats} = require("../controllers/statsController");
const { verifyToken } = require("../middleware/auth");

router.get("/personal",verifyToken, personalStats);

module.exports = router;