const toke = require("../../functionUtil/handlingToken");
const User = require('../../models/models_User');

async function sendResponse(user)
{
    const response = {
        ok: true,
        data: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            removed: true,
        }
    };
    return JSON.stringify(response);
}

async function searchDelete(data, res)
{
    const user = await User.findOne({ _id: data.userId });
    try {
        if (!user) {
            console.log("Pas d'identifiant");
            res.status(404).json();
            return;
        }
        const response = await sendResponse(user);
        User.deleteOne({ _id: data.userId })
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
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
    }
}

module.exports.setRemove = async (req, res) => {
    const tokId = req.headers.authorization;
    const tokenNID = tokId && tokId.split(' ')[1];
    const resTok = await toke.verifyToken(tokenNID);

    try {
        if (resTok.code === 401) {
            res.status(401).json();
            return;
        }
        await searchDelete(resTok.data, res);
        return;
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json("Crash system §");
        return;
    }
};
