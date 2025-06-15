const mongoose = require('mongoose');
const colors = require('colors');
const connectdb = async () => {
    try {
        const uri = process.env.CONNECTION_STRING;
        if (!uri) throw new Error(colors.bgBlack.red("CONNECTION_STRING not defined in .env"));

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(colors.bgBlack.green("MongoDB Connected..."));
    } catch (error) {
        console.log(colors.bgBlack.red("There is an error while connecting to MONGO DB", error));
    }
};

module.exports = connectdb;
