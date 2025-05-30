import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// if (!process.env.REDIS_URL) {
//   throw new Error("❌ Redis connection failed: REDIS_URL not found");
// }

// console.log("✅ Redis connected");

// export const redis = new Redis(process.env.REDIS_URL);
