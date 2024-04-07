const toke = require("../../functionUtil/handlingToken");
const User = require('../../models/models_User');

function sendError(message)
{
    const response = {
        ok: false,
        error: message,
    };
    return JSON.stringify(response);
}

async function sendResponse(data)
{
    const user = await User.findOne({ _id: data.userId });

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

module.exports.setUser = async (req, res) => {
    const tokId = req.headers.authorization;
    const tokenNID = tokId && tokId.split(' ')[1];
    const resTok = await toke.verifyToken(tokenNID);

    try {
        if (resTok.code === 401) {
            res.status(401).json(sendError("Mauvais token JWT."));
            return;
        }
        const response = await sendResponse(resTok.data);
        res.status(200).json(response);
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json(sendError("Erreur interne du serveur."));
        return;
    }
};
