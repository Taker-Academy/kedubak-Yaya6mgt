const toke = require("../../functionUtil/handlingToken");
const Post = require('../../models/models_Post');
const User = require('../../models/models_User');

async function timeComment(userId)
{
    const user = await User.findById(userId).exec();
    const currentTime = new Date().getTime();

    if ((currentTime - user.lastUpVote) >= (60 * 1000)) {
        user.lastUpVote = new Date();
        await user.save();
        return true;
    }
    return false;
}

function sendError(message)
{
    const response = {
        ok: false,
        error: message,
    };
    return response;
}

function sendResponse(posts)
{
    const response = {
        ok: true,
        message: "post upvoted"
    };
    return response;
}

function errorBody(body, res)
{
    if (!body) {
        res.status(422).json(sendError("ID invalide."));
        return 1;
    }
    if (!body.id) {
        res.status(422).json(sendError("ID invalide."));
        return 1;
    }
    if (typeof body.id !== "string") {
        res.status(422).json(sendError("ID invalide."));
        return 1;
    }
    return 0;
}

async function errorRequest(body, myId, res)
{
    if (errorBody(body, res) === 1) {
        return 1;
    }
    const post = await Post.findById(body.id).exec();
    if (!post) {
        res.status(404).json(sendError("Élément non trouvé."));
        return 1;
    }
    const isVote = post.upVotes.indexOf(myId);
    if (isVote !== -1 && post.upVotes) {
        res.status(403).json(sendError("Vous avez déjà voté pour ce post."));
        return 1;
    }
    if (await timeComment(myId) === false) {
        res.status(403).json(sendError("Vous ne pouvez voter que toutes les minutes."));
        return 1;
    }
    return 0;
}

module.exports.setVotePosts = async (req, res) => {
    const tokId = req.headers.authorization;
    const tokenNID = tokId && tokId.split(' ')[1];
    const resTok = await toke.verifyToken(tokenNID);
    const body = req.params;
    try {
        if (resTok.code === 401) {
            res.status(401).json(sendError("Mauvais token JWT."));
            return;
        }
        const errReq = await errorRequest(body, resTok.data.userId, res);
        if (errReq === 1) {
            return;
        }
        const posts = await Post.findById(body.id).exec();
        posts.upVotes.push(resTok.data.userId);
        await posts.save();
        res.status(200).json(sendResponse(posts));
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json(sendError("Erreur interne du serveur."));
        return;
    }
};
