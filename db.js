import mongoose from "mongoose";

module.exports = async function connection() {
  mongoose.Promise = global.Promise;
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(process.env.DB, connectionParams);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to the database");
  }
};
