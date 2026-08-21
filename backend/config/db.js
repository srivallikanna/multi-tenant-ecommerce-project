import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/multitenant_ecomm";
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection unavailable (" + error.message + "). In-Memory database store active.");
  }
};

export default connectDB;