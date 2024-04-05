const express = require("express");
const { setUser } = require("../controllers/control_user");
const { setEdit } = require("../controllers/control_edit");
const { setRemove } = require("../controllers/control_remove");
const router = express.Router();

router.get("/me", setUser);

router.put("/edit", setEdit);

router.delete("/remove", setRemove);

module.exports = router;