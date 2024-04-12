const User = require('../models/models_User');
const Post = require('../models/models_Post');
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

async function addNewUser(body) {
    const emailAlreadyExists = await emailExists(body.email);
    if (emailAlreadyExists === 1) {
        console.log("J'ai deja un mail : " + body.email);
        return 1;
    }
    const hashPass = await hashPassword(body.password);
    try {
        const newUser = new User({
            createdAt: new Date(),
            email: body.email,
            password: hashPass,
            firstName: body.firstName,
            lastName: body.lastName
        });

        const savedUser = await newUser.save();

        console.log('Utilisateur ajouté avec succès :', savedUser);
        return 0;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        return 2;
    }
}

module.exports = { addNewUser };
