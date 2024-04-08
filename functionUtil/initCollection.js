const mongoose = require('mongoose');
const Post = require('../models/models_Post');
const User = require("../models/models_User");

async function initCollection()
{
    mongoose.connection.once('open', async function () {
        const collectionExists = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collectionExists.map(collection => collection.name);
        if (!collectionNames.includes('User')) {
            await User.createCollection();
            console.log('Collection "User" créée avec succès.');
        }
        if (!collectionNames.includes('Post')) {
            await Post.createCollection();
            console.log('Collection "Post" créée avec succès.');
        }
    });
}

module.exports = { initCollection };
