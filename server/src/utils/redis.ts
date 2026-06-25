import { Redis } from "ioredis";
import "dotenv/config"; 

const redisClient = (): Redis => {
  if (process.env.REDIS_URL) {
    console.log("Redis connected successfully");
    return new Redis(process.env.REDIS_URL);
  }
  throw new Error("Redis URL is not defined in the environment variables.");
};

export const redis = redisClient();