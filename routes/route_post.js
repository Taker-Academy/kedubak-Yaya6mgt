const express = require("express");
const { setGetPosts } = require("../controllers/post/control_Getpost");
const { setPostPosts } = require("../controllers/post/control_Postpost");
const { setMePosts } = require("../controllers/post/control_Mepost");
const router = express.Router();

// router.get("/", setGetPosts);

router.post("/", setPostPosts);

// router.get("/me", setMePosts);

module.exports = router;
