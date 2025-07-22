import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  activationTokenOptions,
  hasLoggedInTokenOptions,
  refreshTokenOptions,
} from "../utils/jwt";
import bcryptjs from "bcryptjs";
import {
  getALLUsersService,
  getAllAdminsService,
  getUserId,
  updateUserRoleService,
} from "../services/user.services";
import cloudUploader, { cloudApi } from "../utils/cloudinary";
import { isValidObjectId } from "mongoose";
import Course from "../models/course.model";
import {
  createActivationToken,
  isEmailValid,
  isPasswordStrong,
} from "../utils/helpers";
import { sendToken, TUser } from "../services/signIn.service";

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

    if (
      !name ||
      !email ||
      !password ||
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    if (!isEmailValid.test(email)) {
      return next(new ErrorHandler("Please enter a valid email", 400));
    }

    if (!isPasswordStrong(password)) {
      return next(new ErrorHandler("Password security is too weak", 400));
    }

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists)
      return next(
        new ErrorHandler(
          "Account already exists. Please proceed to sign in to your account",
          409
        )
      );

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user: IRegistration = {
      name,
      email,
      password: hashedPassword,
    };

    const activationToken = createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const data = { user: { name: user.name }, activationCode };

    // save activation token in the response cookie
    res.cookie(
      "activation_Token",
      activationToken.token,
      activationTokenOptions
    );

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });

      res.apiSuccess(
        null,
        "A 6-digit verification code has been sent to your email."
      );
    } catch (error: any) {
      return next(new ErrorHandler("Failed to send mail", 400));
    }
  }
);

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
      return next(new ErrorHandler("Verification code has expired", 401));
    }

    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activationToken,
      process.env.ACTIVATION_SECRET as string
    ) as { user: IUser; activationCode: string };

    if (newUser.activationCode !== activationCode)
      return next(new ErrorHandler("Invalid verification code", 400));

    const { name, email, password } = newUser.user;

    const userExists = await User.findOne({ email });

    if (userExists)
      return next(new ErrorHandler("Account already exists", 409));

    await User.create({
      name,
      email,
      password,
      isVerified: true,
    });

    res.apiSuccess(null, "Account verified successfully", 201);
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

    if (!user) return next(new ErrorHandler("Account not found", 404));

    // check if password matches
    const isPasswordMatch = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatch)
      return next(new ErrorHandler("Invalid credentials", 401));

    // to avoid sending password
    const {
      password: _,
      __v: __,
      createdAt: ___,
      updatedAt: ____,
      ...restOfUser
    } = user.toObject();

    const formattedUser: TUser = {
      _id: restOfUser._id as string,
      avatar: restOfUser.avatar,
      courses: restOfUser.courses,
      email: restOfUser.email,
      isVerified: restOfUser.isVerified,
      name: restOfUser.name,
      role: restOfUser.role,
    };

    sendToken(formattedUser, 200, res);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// logout user

export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("access_token", accessTokenOptions);

    res.clearCookie("refresh_token", refreshTokenOptions);

    res.clearCookie("_can_logged_in", hasLoggedInTokenOptions);

    res.apiSuccess(null, "Logout successfully");
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
        avatar: { id: `${name}+${avatar}`, url: avatar },
      });

      // login user
      const {
        password: _,
        __v: __,
        createdAt: ___,
        updatedAt: ____,
        ...restOfUser
      } = newUser.toObject();

      sendToken(restOfUser as any, 200, res);
    } else {
      // means user has an account already

      // to avoid sending password
      const {
        password: _,
        __v: __,
        createdAt: ___,
        updatedAt: ____,
        ...restOfUser
      } = user.toObject();

      sendToken(restOfUser as any, 200, res);
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

    if (!email || !name)
      return next(new ErrorHandler("Fields are required", 400));

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

      // check if password matches
      const isPasswordMatch = await bcryptjs.compare(
        oldPassword,
        user.password
      );

      if (!isPasswordMatch)
        return next(new ErrorHandler("Invalid old password", 401));

      if (newPassword === oldPassword)
        return next(
          new ErrorHandler(
            "New password must be different from old password",
            403
          )
        );

      user.password = newPassword;

      await user.save();

      res.apiSuccess(null, "Password updated", 201);
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

    if (!avatar) return next(new ErrorHandler("Please provide an image", 400));

    const user = req.user;

    if (Array.isArray(avatar))
      return next(new ErrorHandler("Multiple images not allowed", 403));

    if (!avatar.mimetype?.startsWith("image"))
      return next(
        new ErrorHandler(
          "Invalid image format. File must be an image(.jpg, .png, .jpeg)",
          422
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

    res.apiSuccess(null, "Profile image updated", 201);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// get all users - admin only

export const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    getALLUsersService(res);
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

    if (!admins) return next(new ErrorHandler("Admin not found", 404));

    const admin = admins[0];

    res.apiSuccess(admin, "Admin fetched");
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// update user role - admin only

export const updateUserRole = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, role }: { email: string; role: string } = req.body;

    if (!email || !role)
      return next(
        new ErrorHandler("Please provide your email and select a role", 400)
      );

    updateUserRoleService(res, email, role, next);
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// delete user - admin only

export const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);

    res.apiSuccess(null, "User account deleted");
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////
// verify user latest role
export const getAllUsersLatestInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find({ role: "user" }).select(
        "-courses -isVerified -createdAt -updatedAt -_v -email"
      );

      if (!users) return next(new ErrorHandler("Users not found", 404));

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

    res.apiSuccess(null, "You have completed this lesson. Well done!", 201);
  }
);

// REFRESH TOKENS
export const refreshTokens = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // accessToken expires in
    const accessTokenExpiresAt = new Date(
      Date.now() + accessTokenOptions.maxAge
    ).getTime();

    res.apiSuccess({ expiresAt: accessTokenExpiresAt }, "Tokens Refreshed");
  }
);

// GET COURSES SUMMARY
export const getUserCoursesSummary = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user._id;

    const user = await User.findById(loggedInUserId).lean();

    if (!user || !user.courses)
      return next(new ErrorHandler("User or courses not found", 404));

    const results = await Promise.all(
      user.courses.map(async (courseItem: any) => {
        const course = await Course.findById(courseItem.courseId).lean();

        if (!course) return null;

        return {
          id: course._id,
          name: course.name,
          thumbnail: course.thumbnail,
          ratings: course.ratings,
          purchase: course.purchase,
          progress: courseItem.progress || [],
          reviewed: courseItem.reviewed || false,
        };
      })
    );

    // Filter out any nulls (for courses that weren't found)
    const filteredResults = results.filter((item) => item !== null);

    res.apiSuccess(filteredResults);
  }
);
