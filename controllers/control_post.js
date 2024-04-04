const PostModel = require("../models/models_post");

module.exports.setPosts = async (req, res) => {
    if (!req.body.message) {
        res.status(400).json({message : "Add elements please !"});
    }
    const post = await PostModel.create({
        message: req.body.message,
        author: req.body.author,
    });
    res.status(200).json(post);
};
