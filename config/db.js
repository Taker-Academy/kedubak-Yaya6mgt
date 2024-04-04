const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB mongo is connected !");
    } catch (error) {
        console.log(error);
        process.exit();
    }
};

module.exports = connectDB;
