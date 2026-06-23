const express = require("express");
const router = express.Router();
const {userRegister, userLogin, userLogout, refreshAccessToken} = require("../controllers/authController");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("logout", userLogout);
router.post("refresh", refreshAccessToken);

module.exports = router;