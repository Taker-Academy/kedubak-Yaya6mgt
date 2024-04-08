const toke = require("../../functionUtil/handlingToken");
const User = require('../../models/models_User');
const bcrypt = require('bcrypt');

async function hashPassword(password)
{
    return bcrypt
        .hash(password, 15)
        .then(hash => {
            return hash;
        })
        .catch(error => {
            return "";
        })
}

function sendError(message)
{
    const response = {
        ok: false,
        error: message,
    };
    return response;
}

async function sendResponse(user)
{
    const response = {
        ok: true,
        data: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    };
    return response;
}

async function modifData(user, body, res) {
    try {
        if ((typeof body.lastName !== "string" && body.lastName) || (typeof body.email !== "string" && body.email) ||
        (typeof body.firstName !== "string" && body.firstName) || (typeof body.password !== "string" && body.password)) {
            res.status(422).json(sendError("Échec de validation des paramètres."));
            return;
        }
        if (body.email) {
            await user.updateOne({ email: body.email });
            console.log('Email bien mis à jour !');
        }
        if (body.firstName) {
            await user.updateOne({ firstName: body.firstName });
            console.log('First Name bien mis à jour !');
        }
        if (body.lastName) {
            await user.updateOne({ lastName: body.lastName });
            console.log('Last Name bien mis à jour !');
        }
        if (body.password) {
            const newPass = await hashPassword(body.password);
            await user.updateOne({ password: newPass });
            console.log('Mot de passe bien mis à jour !');
        }
        const response = await sendResponse(user);
        res.status(200).json(response);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la donnée :', error);
        throw error;
    }
}

module.exports.setEdit = async (req, res) => {
    const tokId = req.headers.authorization;
    const tokenNID = tokId && tokId.split(' ')[1];
    const resTok = await toke.verifyToken(tokenNID);

    try {
        if (resTok.code === 401) {
            res.status(401).json(sendError("Mauvais token JWT."));
            return;
        }
        const user = await User.findOne({ _id: resTok.data.userId });
        await modifData(user, req.body, res);
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json(sendError("Erreur interne du serveur."));
    }
};
