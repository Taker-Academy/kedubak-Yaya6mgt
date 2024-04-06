const toke = require("../../functionUtil/handlingToken");
const Post = require('../../models/models_Post');
const { response } = require("express");

async function getAllPosts(data) {
    try {
        const posts = await Post.find({userId: data.userId});
        const postClean = posts.map(post => {
            const { __v, updatedAt, ...newPost } = post.toObject();
            return newPost;
        });
        return postClean;
    } catch (error) {
        console.error('Erreur lors de la récupération des posts :', error);
        throw error;
    }
}

function sendError(message)
{
    const response = {
        ok: false,
        error: message,
    };
    return JSON.stringify(response);
}

function sendResponse(post)
{
    const response = {
        ok: true,
        data: post,
    };
    console.log("response ==> " + response);
    return JSON.stringify(response);
}

module.exports.setMePosts = async (req, res) => {
    const tokId = req.headers.authorization;
    const tokenNID = tokId && tokId.split(' ')[1];
    const resTok = await toke.verifyToken(tokenNID);

    try {
        if (resTok.code === 401) {
            res.status(401).json(sendError("Mauvais token JWT."));
            return;
        }
        const allPost = await getAllPosts(resTok.data);
        const response = sendResponse(allPost);
        res.status(200).json(response);
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json(sendError("Erreur interne du serveur."));
        return;
    }
};
