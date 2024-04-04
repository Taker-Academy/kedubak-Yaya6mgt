const User = require('../models/models_User');
const Post = require('../models/models_Post');

// async function errorForRegister(body, res)
// {
//     if (!(body)) {
//         res.status(400);
//         return 1;
//     }
//     if (typeof body !== "object" || Object.keys(body).length !== 4 ||
//     !body.email || !body.password || !body.firstName || !body.lastName ||
//     typeof body.email !== "string" || typeof body.password !== "string" ||
//     typeof body.lastName !== "string" || typeof body.firstName !== "string") {
//         res.status(400);
//         return 1;
//     }
//     return 0;
// }
// module.exports = { errorForRegister };

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

async function addNewUser(body) {
    const emailAlreadyExists = await emailExists(body.email);
    if (emailAlreadyExists === 1) {
        console.log("J'ai deja un mail : " + body.email);
        return 1;
    }
    try {
        const newUser = new User({
            createdAt: new Date(),
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName
        });

        const savedUser = await newUser.save();

        console.log('Utilisateur ajouté avec succès :', savedUser);
        return 0;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        return 1;
    }
}

module.exports = { addNewUser };