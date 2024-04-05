const express = require("express");
const { setGetPosts } = require("../controllers/control_Getpost");
const { setPostPosts } = require("../controllers/control_Postpost");
const router = express.Router();

//A finir
router.get("/", setGetPosts);

//A finir
router.post("/", setPostPosts);

module.exports = router;
