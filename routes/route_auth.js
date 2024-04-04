const express = require("express");
const { setRegister } = require("../controllers/control_auth");
const router = express.Router();

router.post("/register", setRegister);

module.exports = router;
