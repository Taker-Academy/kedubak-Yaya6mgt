const { json } = require("express");
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

function sendResponse(post)
{
    const response = {
        ok: true,
        data: post,
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

async function errorRequest(body, res, id)
{
    if (errorBody(body, res) === 1) {
        return 1;
    }
    const posts = await Post.findById(body.id).exec();
    if (!posts) {
        res.status(404).json(sendError("Élément non trouvé."));
        return 1;
    }
    if (posts.userId !== id) {
        res.status(403).json(sendError("L'utilisateur n'est pas le propriétaire de l'élément."));
        return 1;
    }
    return 0;
}

async function deletePost(id)
{
    Post.deleteOne({ _id: id })
        .then(result => {
            if (result.deletedCount > 0) {
                console.log('Utilisateur supprimé avec succès.');
            } else {
                console.log('Aucun utilisateur trouvé avec cet ID.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        });
}

module.exports.delIdPosts = async (req, res) => {
    const tokId = req.headers.authorization;
    const tokenNID = tokId && tokId.split(' ')[1];
    const resTok = await toke.verifyToken(tokenNID);
    const body = req.params;

    try {
        if (resTok.code === 401) {
            res.status(401).json(sendError("Mauvais token JWT."));
            return;
        }
        const errReq = await errorRequest(body, res, resTok.data.userId);
        if (errReq === 1) {
            return;
        }
        const posts = await Post.findById(body.id ).exec();
        await deletePost(body.id);
        await res.status(200).json(sendResponse(posts));
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json(sendError("Erreur interne du serveur."));
        return;
    }
};