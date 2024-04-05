const { addNewUser } = require("../functionUtil/handlingRegister");
const User = require('../models/models_User');
const toke = require("../functionUtil/handlingToken");

function errorForRegister(body, res)
{
    if (!(body)) {
        res.status(400).json("Body vide");
        return 1;
    }
    if (typeof body !== "object" || Object.keys(body).length !== 4 ||
    !body.email || !body.password || !body.firstName || !body.lastName ||
    typeof body.email !== "string" || typeof body.password !== "string" ||
    typeof body.lastName !== "string" || typeof body.firstName !== "string") {
        res.status(400).json("Erreur de saisie");
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

module.exports.setRegister = async (req, res) => {
    const body = req.body;
    try {
        const error = errorForRegister(body, res);
        if (error === 1) {
            return;
        }
        const newUseRes = await addNewUser(body);
        if (newUseRes === 1) {
            res.status(401).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur !' });
            return;
        }
        const user = await sendResponse(body);
        res.status(200).json(JSON.parse(user));
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500);
        return;
    }
};
