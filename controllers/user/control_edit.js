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

async function emailExists(email) {
    try {
        const user = await User.findOne({ email: email });
        console.log(user);
        if (user) {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'utilisateur :', error);
        return false;
    }
}

function verifierFormatEmail(chaine)
{
    const regex = /^[^@]+@[^@]+\.[^@]{5,}$/;
    return regex.test(chaine);
}

function sendError(message)
{
    const response = {
        ok: false,
        error: message,
    };
    return response;
}

async function sendResponse(lastName, firstName, email)
{
    console.log("\n\nemail ==>" + email);
    const response = {
        ok: true,
        data: {
            email: email,
            firstName: firstName,
            lastName: lastName,
        }
    };
    return response;
}

async function modifData(user, body, res) {
    try {
        var email = "";
        var lastName = "";
        var firstName = "";

        if ((typeof body.lastName !== "string") || (typeof body.email !== "string") ||
        (typeof body.firstName !== "string") || (typeof body.password !== "string")) {
            res.status(422).json(sendError("Échec de validation des paramètres."));
            return;
        }
        console.log("\n\n\n user ==> " + user.email + "\n body ==> " + body.email + "\n\n\n");
        if (body.email) {
            if (await emailExists(body.email) === 1) {
                res.status(400).json(sendError("Échec de validation des paramètres."));
                return;
            }
            email = body.email;
            await user.updateOne({ email: body.email });
            console.log('Email bien mis à jour !');
        } else {
            email = user.email;
        }
        if (body.firstName) {
            firstName = body.firstName;
            await user.updateOne({ firstName: body.firstName });
            console.log('First Name bien mis à jour !');
        } else {
            firstName = user.firstName;
        }
        if (body.lastName) {
            lastName = body.lastName;
            await user.updateOne({ lastName: body.lastName });
            console.log('Last Name bien mis à jour !');
        } else {
            lastName = user.lastName;
        }
        if (body.password) {
            const newPass = await hashPassword(body.password);
            await user.updateOne({ password: newPass });
            console.log('Mot de passe bien mis à jour !');
        }
        const response = await sendResponse(lastName, firstName, email);
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
        const user = await User.findById(resTok.data.userId).exec();
        await modifData(user, req.body, res);
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json(sendError("Erreur interne du serveur."));
    }
};
