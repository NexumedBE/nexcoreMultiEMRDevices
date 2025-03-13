import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("🚨 MONGO_URI is missing! Backend cannot connect to MongoDB.");
      return; // ❌ Don't exit immediately, just log the error
    }

    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected!");
  } catch (err: any) {
    console.error("❌ MongoDB Connection Error:", err.message);

    // 🔄 Retry after 5 seconds instead of crashing
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
