const express = require("express");
const { setPosts } = require("../controllers/control_post");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({message:"voix ci lé donné" });
});

router.post("/", setPosts);

router.put('/:id', (req, res) => {
    res.json({messageId: req.params.id});
});

router.delete("/:id", (req, res) => {
    res.json({message: "Post supprimé id : " + req.params.id});
});

router.patch("/like-post/:id", (req, res) => {
    res.json({message: "Post liker :id : " + req.params.id});
});

router.patch("/dislike-post/:id", (req, res) => {
    res.json({message: "Post disliker :id : " + req.params.id});
});

module.exports = router;
