const express = require("express");
const { setGetPosts } = require("../controllers/post/control_Getpost");
const { setPostPosts } = require("../controllers/post/control_Postpost");
const { setMePosts } = require("../controllers/post/control_Mepost");
const { setIdPosts } = require("../controllers/post/control_Idpost");
const { delIdPosts } = require("../controllers/post/control_delIdpost");
const { setVotePosts } = require("../controllers/post/control_Votepost");
const router = express.Router();

router.get("/", setGetPosts);

router.post("/", setPostPosts);

router.get("/me", setMePosts);

router.get("/:id", setIdPosts);

router.delete("/:id", delIdPosts);

//time no present
router.post("/vote/:id", setVotePosts);

module.exports = router;
