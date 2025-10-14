const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri)
      throw (
        (new Error(colors.bgBlack("There is no connection string provided")),
        process.exit(1))
      );
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(colors.bgGreen("MONGODB CONNECTED."));
  } catch (error) {
    console.log(
      colors.bgRed("There is an error while connecting to mongodb.", error)
    );
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log(colors.bgYellow("MongoDB disconnected Successfully."));
  } catch (error) {
    console.log(
      colors.bgRed("There is an error while disconnecting MONGODB", error)
    );
  }
};

module.exports = { connectDB, disconnectDB };
