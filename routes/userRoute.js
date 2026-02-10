import express from "express";
import {
  createUserController,
  forgotPasswordController,
  loginUserController,
  updatePasswordController,
  updateProfileController,
  updateUserPhotoController,
  userLogoutController,
  userProfileController,
} from "../controllers/userController.js";
import { isAuth } from "../middleware/Authorization.js";
import { singleStorage } from "../middleware/multer.js";
const router = express.Router();

// login
router.post("/login", loginUserController);
// register
router.post("/register", createUserController);
// user-profile
router.get("/profile", isAuth, userProfileController);

// user logout
router.get("/logout", isAuth, userLogoutController);

// update profile
router.put("/update-profile", isAuth, updateProfileController);
// change password
router.put("/update-password", isAuth, updatePasswordController);

// update photo
router.put("/photo", isAuth, singleStorage, updateUserPhotoController);

// forgot password
router.post("/forgot-password", forgotPasswordController);

export default router;
