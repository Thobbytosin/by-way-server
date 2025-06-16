import mongoose, { Document, Schema, Model } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  createdAt: string;
  updatedAt: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
        progress: [{ videoId: String, viewed: Boolean }],
        reviewed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model("User", userSchema);

export default User;
