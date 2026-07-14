import mongoose from "mongoose";
import "dotenv/config";
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const dbUrl: string =
  process.env.DB_URI || "mongodb://localhost:27017/mydatabase";

const connectDB = async (): Promise<void> => {
  try {
    const data = await mongoose.connect(dbUrl);
    console.log(`MongoDB connected successfully to: ${data.connection.host}`);
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);
    if (process.env.VERCEL) {
      throw error;
    }
    setTimeout(() => {
      connectDB();
    }, 5000);
    process.exit(1);
  }
};

export default connectDB;
