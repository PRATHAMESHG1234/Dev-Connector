const mongoos = require("mongoose");

const config = require("config");

const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoos.connect(db, {});

    console.log("mongoDB connected....");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
