const User = require("../models/models_User");
const bcrypt = require('bcrypt');
const toke = require("../functionUtil/handlingToken");

async function compareMdp(pass1, pass2)
{
    return bcrypt
        .compare(pass2, pass1)
        .then( res => {
            if (res) {
                return 0;
            } else {
                return 1;
            }
        })
        .catch(err => {
            return false;
        })
}

async function emailAndMdpExists(body) {
    try {
        const user = await User.findOne({ email: body.email });
        console.log(user);
        if (!user) {
            console.log("Mauvais email!");
            return 1;
        }
        const resultMdp = await compareMdp(user.password, body.password);
        if (resultMdp === 1) {
            console.log("Mauvais mot de passe !");
            return 1;
        }
        return 0;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'utilisateur :', error);
        return false;
    }
}

async function getDataWithMail(email) {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return user;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'utilisateur :', error);
        return false;
    }
}

async function verifLogin(body)
{
    try {
        const emailMdpExists = await emailAndMdpExists(body);
        if (emailMdpExists === 1) {
            return 1;
        }
        return 0;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'utilisateur :', error);
        return false;
    }
}

async function errorForLogin(body, res)
{
    if (!(body)) {
        res.status(400).json("Body vide");
        return 1;
    }
    if (typeof body !== "object" || Object.keys(body).length !== 2 ||
    !body.email || !body.password || typeof body.email !== "string" || typeof body.password !== "string") {
        res.status(400).json("Erreur de saisie");
        return 1;
    }
    const resultLog = await verifLogin(body);
    if (resultLog === 1) {
        res.status(401).json("Erreur de login");
        return 1;
    }
    return 0;
}

async function sendResponse(body)
{
    const user = await User.findOne({ email: body.email });
    const createTok = await toke.createToken(user);
    const response = {
        ok: true,
        data: {
            token: createTok,
            user: {
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
            }
        }
    };
    return JSON.stringify(response, null, 4);
}

module.exports.setLogin = async (req, res) => {
    const body = req.body;
    try {
        const errorLog = await errorForLogin(body, res);
        if (errorLog === 1) {
            return;
        }
        const newBody = await getDataWithMail(body.email);
        console.log(newBody);
        const user = await sendResponse(newBody);
        res.status(200).json(JSON.parse(user));
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json("Crash system §");
        return;
    }
};