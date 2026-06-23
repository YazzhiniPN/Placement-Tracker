const express = require("express");
const router = express.Router();
const {personalStats} = require("../controllers/statsController");

router.get("/personal", personalStats);

module.exports = router;