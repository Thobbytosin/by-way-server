import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, sendToken } from "../utils/jwt";

import {
  getALLUsersService,
  getAllAdminsService,
  getUserId,
  updateUserRoleService,
} from "../services/user.services";
import cloudUploader, { cloudApi } from "../utils/cloudinary";
import { isValidObjectId } from "mongoose";

dotenv.config();

////////////////////////////////////////////////////////////////////////
// Register user
interface IRegistration {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body as IRegistration;

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists)
      return next(new ErrorHandler("Email already exists", 400));

    const user: IRegistration = {
      name,
      email,
      password,
    };

    const activationToken = createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const data = { user: { name: user.name }, activationCode };

    // save activation token in the response cookie
    res.cookie("activation_Token", activationToken.token, accessTokenOptions);

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });

      res.apiSuccess(
        null,
        `An activation token has been sent to your email: ${user.email}.`
      );
    } catch (error: any) {
      return next(new ErrorHandler("Something went wrong", 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

// function to create an activation token and activation code
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  // activation token to be used for email activation
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};

////////////////////////////////////////////////////////////////////////

// activate user
interface IActivationRequest {
  activationCode: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activationCode } = req.body as IActivationRequest;

    const activationToken = req.cookies.activation_Token;

    if (!activationToken) {
      return next(new ErrorHandler("Activation code has expired", 401));
    }

    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activationToken,
      process.env.ACTIVATION_SECRET as string
    ) as { user: IUser; activationCode: string };

    if (newUser.activationCode !== activationCode)
      return next(new ErrorHandler("Invalid activation code", 422));

    const { name, email, password } = newUser.user;

    const userExists = await User.findOne({ email });

    if (userExists)
      return next(new ErrorHandler("Account already exists", 422));

    await User.create({
      name,
      email,
      password,
      emailVerified: true,
    });

    res.apiSuccess(null, "Account registered", 201);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// login user

interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as ILoginRequest;

    if (!email || !password)
      return next(
        new ErrorHandler("Please enter your email and password", 400)
      );

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return next(new ErrorHandler("Invalid username or password", 404));

    // check if password matches
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch)
      return next(new ErrorHandler("Invalid credentials", 404));

    // to avoid sending password
    const userr = await User.findOne({ email });

    if (!userr)
      return next(new ErrorHandler("Invalid username or password", 404));

    sendToken(userr, 200, res);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// logout user

export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("access_Token");
    res.clearCookie("refresh_Token");
    res.clearCookie("_can_logged_t");

    res.apiSuccess(null, "Logout successful");
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// get user information

export const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id as any;
    getUserId(res, userId);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// social authentication

interface ISocialAuthBody {
  name: string;
  email: string;
  avatar?: string;
}

export const socialAuth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocialAuthBody;

      if (!name || !email || name.trim() === "" || email.trim() === "")
        return next(new ErrorHandler("Please provide name and email", 400));

      const user = await User.findOne({ email });

      if (!user) {
        // generate password (password is required for login)

        const generatePassword = Math.random().toString(36).slice(-10);

        const newUser = await User.create({
          name,
          email,
          password: generatePassword,
          avatar,
        });
        // to remove the password from being sent to the frontend
        const user = await User.findOne({ email: newUser.email }).select(
          "-password"
        );

        if (!user) return next(new ErrorHandler("No user found", 404));

        // login user
        sendToken(user, 200, res);
      } else {
        // means user has an account already

        // so just login
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.name, 400));
    }
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// update user info

interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body as IUpdateUserInfo;

    const userId = req.user?._id as any;

    const user = await User.findById(userId);

    if (!user) return next(new ErrorHandler("User not found", 404));

    if (email) {
      const isEmailExists = await User.findOne({ email });

      if (isEmailExists)
        return next(new ErrorHandler("Email already exists", 406));

      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    // await redis.set(`user - ${userId}`, JSON.stringify(user));

    res.apiSuccess(null, "Profile updated", 201);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// update user password

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newPassword, oldPassword } = req.body as IUpdatePassword;

      if (!newPassword || !oldPassword)
        return next(new ErrorHandler("Please enter old and new password", 400));

      const userId = req.user?._id as any;

      const user = await User.findById(userId).select("+password");

      if (!user) return next(new ErrorHandler("Invalid user", 404));

      const isPasswordMatch = await user.comparePassword(oldPassword);

      if (!isPasswordMatch)
        return next(new ErrorHandler("Invalid old password", 400));

      if (newPassword === oldPassword)
        return next(
          new ErrorHandler(
            "New password must be different from old passwprd",
            422
          )
        );

      user.password = newPassword;

      await user.save();

      // await redis.set(`user - ${userId}`, JSON.stringify(user));

      res.apiSuccess(null, "Password updated");
    } catch (error: any) {
      return next(new ErrorHandler(error.name, 400));
    }
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// update profile picture

interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { avatar } = req.files;

    // console.log(avatar);

    if (!avatar) return next(new ErrorHandler("Please provide an image", 422));

    const userId = req?.user._id as any;

    if (!userId)
      return next(new ErrorHandler("Please log in to upload picture.", 403));

    const user = await User.findById(userId);

    if (!user) return next(new ErrorHandler("User not found", 404));

    if (Array.isArray(avatar))
      return next(new ErrorHandler("Multiple images not allowed", 422));

    if (!avatar.mimetype?.startsWith("image"))
      return next(
        new ErrorHandler(
          "Invalid image format. File must be an image(.jpg, .png, .jpeg)",
          404
        )
      );

    // delete the old avatar from the cloudinary db
    if (user.avatar.id) {
      const folderPath = `byWay/users/${user.name + " - " + user._id}`;
      await cloudApi.delete_resources_by_prefix(folderPath);
    }

    // upload the new avatar to the cloudinary db

    // create a folder and subfolder for each user
    const folderPath = `byWay/users/${user.name + " - " + user._id}`;

    // upload the new avatar to the cloudinary db
    await cloudUploader.upload(
      avatar.filepath,
      {
        folder: folderPath,
        transformation: {
          width: 500,
          height: 500,
          crop: "thumb",
          gravity: "face",
        },
      },
      async (error: any, result) => {
        if (error) return next(new ErrorHandler(error.message, 400));

        const publicId = result?.public_id;

        const imageId = publicId?.split("/").pop();

        const imageUrl = result?.secure_url;

        user.avatar.url = imageUrl || "";
        user.avatar.id = imageId || "";

        // await redis.set(`user - ${userId}`, JSON.stringify(user));

        await user.save();
      }
    );

    res.apiSuccess(null, "Avatar updated", 201);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// get all users - admin only

export const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getALLUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.name, 400));
    }
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// get admins list

export const getAllAdmins = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    getAllAdminsService(res, next);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// get admin

export const getAdmin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    if (!admins) return next(new ErrorHandler("Admins not found", 404));

    const admin = admins[0];

    res.apiSuccess(admin, "Admin fetched");
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// update user role - admin only

export const updateUserRole = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;

      if (!email || !role) return next(new ErrorHandler("Invalid entry", 422));

      // if (!isValidObjectId(userId))
      //   return next(new ErrorHandler("Invalid id", 422));

      updateUserRoleService(res, email, role, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.name, 400));
    }
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// delete user - admin only

export const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      // console.log(userId);

      const user = await User.findById(userId);

      if (!user) return next(new ErrorHandler("User not found", 404));

      await user.deleteOne();

      // await redis.del(`user - ${userId}`);

      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.name, 400));
    }
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// verify user latest role
export const getAllUsersLatestInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find().select(
        "-courses -isVerified -createdAt -updatedAt -_v -email"
      );

      if (!users) return next(new ErrorHandler("User not found", 404));

      res.apiSuccess(users, "Users list fetched");
    } catch (error: any) {
      return next(new ErrorHandler(error.name, 400));
    }
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// update mark video as viewed

export const markVideoAsViewed = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id as any;

    if (!isValidObjectId(userId))
      return next(new ErrorHandler("Invalid user id", 422));

    const { courseId, videoId } = req.body;

    const user = await User.updateOne(
      {
        _id: userId,
        "courses.courseId": courseId,
        "courses.progress.videoId": videoId,
      },
      { $set: { "courses.$.progress.$[video].viewed": true } },
      { arrayFilters: [{ "video.videoId": videoId }] }
    );

    if (!user) return next(new ErrorHandler("User not found", 404));

    const newUser = await User.findById(userId);

    //   update user to redis
    // await redis.set(
    //   `user - ${newUser?._id as string}`,
    //   JSON.stringify(newUser) as any
    // );

    res.apiSuccess(null, "You have completed this lesson. Well done!");
  }
);

// REFRESH TOKENS
export const refreshTokens = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // accessToken expires in
    const accessTokenExpiresAt = new Date(
      Date.now() + accessTokenOptions.maxAge
    ).getTime();

    res.status(200).json({
      success: true,
      message: "Tokens Refreshed",
      expiresAt: accessTokenExpiresAt,
    });
  }
);
