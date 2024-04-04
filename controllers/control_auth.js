const UserModel = require("../models/models_User");

function errorForRegister(body)
{
    if (!(body)) {
        res.status(400);
        return 1;
    }
    if (typeof body !== "object" || Object.keys(body).length !== 4 ||
    !body.email || !body.password || !body.firstName || !body.lastName ||
    typeof body.email !== "string" || typeof body.password !== "string" ||
    typeof body.lastName !== "string" || typeof body.firstName !== "string") {
        res.status(400);
        return 1;
    }
    return 0;
}

module.exports.setRegister = async (req, res) => {
    const body = req.body;
    try {
        if (errorForRegister(body) == 1) {
            return;
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500);
    }
};
