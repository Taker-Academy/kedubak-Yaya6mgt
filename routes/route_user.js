const express = require("express");
const { setUser } = require("../controllers/control_user");
const router = express.Router();

router.get("/me", setUser);

module.exports = router;