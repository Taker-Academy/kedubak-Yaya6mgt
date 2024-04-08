const toke = require("../../functionUtil/handlingToken");
const User = require('../../models/models_User');
const Post = require('../../models/models_Post');
const { ObjectId } = require("mongodb");

function sendResponse(user, content)
{
    const response = {
        ok: true,
        data: {
            firstName: user.firstName,
            content: content,
            createdAt: Date.now(),
        }
    };
    return response;
}

function sendError(message)
{
    const response = {
        ok: false,
        error: message,
    };
    return response;
}

async function errorRequete(body, params)
{
    if (!body || !params) {
        console.log("Body ou Params vide.");
        return 1;
    }
    if (!body.content || !params.id) {
        console.log("Contenue ou id manquant.");
        return 1;
    }
    if (typeof body.content !== "string" || typeof params.id !== "string") {
        console.log("Contenue ou id de mauvais type.");
        return 1;
    }
    const post = await Post.findById(params.id ).exec();
    if (!post) {
        res.status(404).json(sendError("Élément non trouvé."));
        return 1;
    }
    return 0;
}

async function createComment(content, user, id)
{
    const post = await Post.findById(id).exec();

    const comment = {
        createdAt: Date.now(),
        id: new ObjectId(),
        firstName: user.firstName,
        content: content,
    };
    post.comments.push(comment);
    await post.save();
}

module.exports.setPostComment = async (req, res) => {
    const tokId = req.headers.authorization;
    const tokenNID = tokId && tokId.split(' ')[1];
    const resTok = await toke.verifyToken(tokenNID);
    const body = req.body;
    const params = req.params;

    try {
        if (resTok.code === 401) {
            res.status(401).json(sendError("Mauvais token JWT."));
            return;
        }
        if (await errorRequete(body, params) === 1) {
            res.status(400).json(sendError("Mauvaise requête, paramètres manquants ou invalides."));
            return;
        }
        const user = await User.findById(resTok.data.userId).exec();
        await createComment(body.content, user, params.id)
        res.status(201).json(sendResponse(user, body.content));
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json(sendError("Erreur interne du serveur."));
        return;
    }
};
