const toke = require("../../functionUtil/handlingToken");
const Post = require('../../models/models_Post');

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
        data: posts,
    };
    return response;
}

function errorBody(body, res)
{
    if (!body) {
        res.status(400).json(sendError("Mauvaise requête, paramètres manquants ou invalides."));
        return 1;
    }
    if (!body.id) {
        res.status(400).json(sendError("Mauvaise requête, paramètres manquants ou invalides."));
        return 1;
    }
    if (typeof body.id !== "string") {
        res.status(400).json(sendError("Mauvaise requête, paramètres manquants ou invalides."));
        return 1;
    }
    return 0;
}

async function errorRequest(body, res)
{
    if (errorBody(body, res) === 1) {
        return 1;
    }
    const post = await Post.findById({ _id: body.id }).exec();
    if (!post) {
        res.status(404).json(sendError("Élément non trouvé."));
        return 1;
    }
    return 0;
}

module.exports.setIdPosts = async (req, res) => {
    const tokId = req.headers.authorization;
    const tokenNID = tokId && tokId.split(' ')[1];
    const resTok = await toke.verifyToken(tokenNID);
    const body = req.params;

    try {
        if (resTok.code === 401) {
            res.status(401).json(sendError("Mauvais token JWT."));
            return;
        }
        const errReq = await errorRequest(body, res);
        if (errReq === 1) {
            return;
        }
        const posts = await Post.findById({ _id: body.id }).exec();
        res.status(200).json(sendResponse(posts));
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json(sendError("Erreur interne du serveur."));
        return;
    }
};
