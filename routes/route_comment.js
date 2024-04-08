const express = require("express");
const { setPostComment } = require("../controllers/comment/control_Postcomment");
const router = express.Router();

router.post("/:id", setPostComment);

module.exports = router;
