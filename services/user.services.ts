import { NextFunction, Response } from "express";
import User from "../models/user.model";
// import { redis } from "../utils/redis";
import ErrorHandler from "../utils/errorHandler";
import { TUser } from "./signIn.service";

// get user by id
export const getUserId = async (res: Response, id: string) => {
  // const userJson = await redis.get(`user - ${id}`);
  const userJson = false;

  if (userJson) {
    const user = JSON.parse(userJson);

    res.apiSuccess(user, "User fetched");
  } else {
    const user = await User.findById(id);
    if (!user) return;

    const formattedUser: TUser = {
      _id: user._id as string,
      avatar: user.avatar,
      courses: user.courses,
      email: user.email,
      isVerified: user.isVerified,
      name: user.name,
      role: user.role,
    };

    res.apiSuccess(formattedUser, "User fetched");
  }
};

// get all users
export const getALLUsersService = async (res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.apiSuccess(users, "Users fetched");
};

// get all admins
export const getAllAdminsService = async (
  res: Response,
  next: NextFunction
) => {
  const admins = await User.find({ role: "admin" })
    .select("-password")
    .sort({ createdAt: -1 });

  if (!admins) return next(new ErrorHandler("Admins not found", 404));

  res.apiSuccess(admins, "Admin list fetched");
};

// update user role - admin only
export const updateUserRoleService = async (
  res: Response,
  email: string,
  role: string,
  next: NextFunction
) => {
  const user = await User.findOneAndUpdate(
    { email },
    {
      role,
    },
    { new: true }
  );

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.apiSuccess(null, "Role updated", 201);
};
