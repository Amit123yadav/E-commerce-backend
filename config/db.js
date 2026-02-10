import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `mongoDB connected successfully ${mongoose.connection.host}`.bgGreen.white
    );
  } catch (error) {
    console.log(`mongoDB connection error: ${error}`.bgRed.white);
  }
};

export default connectDB;
