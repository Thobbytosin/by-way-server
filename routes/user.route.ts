import express from "express";
import {
  activateUser,
  deleteUser,
  getAdmin,
  getAllAdmins,
  getAllUsers,
  getAllUsersLatestInfo,
  getUserCoursesSummary,
  getUserInfo,
  loginUser,
  logoutUser,
  markVideoAsViewed,
  refreshTokens,
  registerUser,
  socialAuth,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isUserAuthenticated } from "../middlewares/auth";
import { fileParser } from "../middlewares/fileParser";
import { updateTokens } from "../middlewares/updateTokens";

const userRouter = express.Router();

// register user
userRouter.post("/registration", registerUser);

// activate user account(verify email)
userRouter.post("/activate-user", activateUser);

// login user
userRouter.post("/login", loginUser);

// logout user
userRouter.post("/logout", isUserAuthenticated, logoutUser);

// refresh  tokens  (to keep user logged in)
userRouter.get("/refresh-tokens", updateTokens, refreshTokens);

// get user profile
userRouter.get("/me", isUserAuthenticated, getUserInfo);

// login user with social accounts
userRouter.post("/social-auth", socialAuth);

// update user profile (name and email)
userRouter.put("/update-user-info", isUserAuthenticated, updateUserInfo);

// update user password
userRouter.put("/update-user-password", isUserAuthenticated, updatePassword);

// update user profile image
userRouter.put(
  "/update-profile-picture",
  isUserAuthenticated,
  fileParser,
  updateProfilePicture
);

// get all users (admin only)
userRouter.get(
  "/get-all-users",
  isUserAuthenticated,
  authorizeRoles("admin"),
  getAllUsers
);

// get all admins
userRouter.get("/get-admin-list", isUserAuthenticated, getAllAdmins);

// update user role (admin only)
userRouter.put(
  "/update-user-role",
  isUserAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

// delete user account (admin only)
userRouter.delete(
  "/delete-user/:userId",
  isUserAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

// update userVideoViewed
userRouter.put(
  "/update-user-videos-viewed",
  isUserAuthenticated,
  markVideoAsViewed
);

userRouter.get("/get-users-list", getAllUsersLatestInfo);

userRouter.get("/get-admin", getAdmin);

userRouter.get(
  "/get-user-courses-summary",
  isUserAuthenticated,
  getUserCoursesSummary
);

export default userRouter;
