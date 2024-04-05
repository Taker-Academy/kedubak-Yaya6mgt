const express = require("express");
const { setRegister } = require("../controllers/control_register");
const { setLogin } = require("../controllers/control_login");
const router = express.Router();

router.post("/register", setRegister);

router.post("/login", setLogin);

module.exports = router;
