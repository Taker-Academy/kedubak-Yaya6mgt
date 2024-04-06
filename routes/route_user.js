const express = require("express");
const { setUser } = require("../controllers/user/control_user");
const { setEdit } = require("../controllers/user/control_edit");
const { setRemove } = require("../controllers/user/control_remove");
const router = express.Router();

router.get("/me", setUser);

router.put("/edit", setEdit);

router.delete("/remove", setRemove);

module.exports = router;