const toke = require("../functionUtil/handlingToken");
const User = require('../models/models_User');

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
    return JSON.stringify(response);
}

module.exports.setUser = async (req, res) => {
    const tokId = req.headers.authorization;
    const tokenNID = tokId && tokId.split(' ')[1];
    const resTok = await toke.verifyToken(tokenNID);

    try {
        if (resTok.code === 401) {
            res.status(401).json();
            return;
        }
        const response = await sendResponse(resTok.data);
        res.status(200).json(response);
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json("Crash system §");
        return;
    }
};
