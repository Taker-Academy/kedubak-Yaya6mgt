const toke = require("../functionUtil/handlingToken");
const User = require('../models/models_User');
const Post = require('../models/models_Post');

async function sendResponse(post)
{
    const response = {
        ok: true,
        data: {
            _id: post._id,
            createdAt: post.createdAt,
            userId: post.userId,
            firstName: post.firstName,
            title: post.title,
            content: post.content,
            comments: [],
            upVotes: [],
        }
    };
    return JSON.stringify(response);
}

async function createPost(body, data)
{
    const user = await User.findOne({ _id: data.userId });
    try {
        const newPost = new Post({
            createdAt: new Date(),
            userId: user._id,
            firstName: user.firstName,
            title: body.title,
            content: body.content,
            comment: [],
            upVotes: [],
        });

        const savedPost = await newPost.save();
        console.log('Post ajouté avec succès.');
        return savedPost;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        return false;
    }
}

function errorRequete(body)
{
    if (!body) {
        console.log("Body vide.");
        return 1;
    }
    if (!body.title || !body.content) {
        console.log("Titre ou contenue manquant.");
        return 1;
    }
    if (typeof body.title !== "string" || typeof body.content !== "string") {
        console.log("Titre ou contenue de mauvais type.");
        return 1;
    }
    return 0;
}

module.exports.setPostPosts = async (req, res) => {
    const tokId = req.headers.authorization;
    const tokenNID = tokId && tokId.split(' ')[1];
    const resTok = await toke.verifyToken(tokenNID);
    const body = req.body;

    try {
        if (resTok.code === 401) {
            res.status(401).json();
            return;
        }
        if (errorRequete(body) === 1) {
            res.status(400).json();
            return;
        }
        const post = await createPost(body, resTok.data);
        const response = await sendResponse(post);
        console.log(response);
        res.status(201).json(response);
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json("Crash system §");
        return;
    }
};