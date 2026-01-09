import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const connectDB = async (): Promise<void> => {
  const uri = (process.env.MONGODB_CONNECTIONSTRING || "").trim();
  if (!uri) {
    const err = new Error(
      "MONGODB_CONNECTIONSTRING is not set. Add it to .env or set the environment variable."
    );
    console.error(err.message);
    throw err;
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
};

export default connectDB;
