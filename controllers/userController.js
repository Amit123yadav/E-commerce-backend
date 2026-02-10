import userModel from "../model/userModel.js";
import userSchema from "../model/userModel.js";
import colors from "colors";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/Features.js";
export const createUserController = async (req, res) => {
  try {
    const { name, email, password, country, city, phone, address, answer } =
      req.body;
    if (
      !name ||
      !email ||
      !password ||
      !country ||
      !city ||
      !phone ||
      !address ||
      !answer
    ) {
      return res.status(400).send({
        message: "All fields are required",
        status: false,
      });
    }

    const existingUser = await userSchema.findOne({ email });

    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = await userSchema.create({
      name,
      email,
      password,
      country,
      city,
      phone,
      address,
      answer,
    });

    res.status(201).send({
      message: "User registered successfully",
      status: true,
      newUser,
    });
  } catch (error) {
    console.log(`Error in user registration ${error}`.bgRed.white);
    res.status(500).send({
      message: "Error in user registration",
      status: false,
      error,
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: "Email and Password are required",
        status: false,
      });
    }
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        status: false,
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = user.generateToken();
    user.password = undefined;
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_DEV == "development" ? true : false,
        httpOnly: process.env.NODE_DEV == "development" ? true : false,
        sameSite: process.env.NODE_DEV == "development" ? true : false,
      })
      .send({
        message: "User logged in successfully",
        status: true,
        token,
        user,
      });
  } catch (error) {
    console.log(`Error in user login ${error}`.bgRed.white);
    res.status(500).send({
      message: "Error in user login",
      status: false,
      error,
    });
  }
};

export const userProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Profile Created SuccessFully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in profile Api",
      error,
    });
  }
};

export const userLogoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_DEV == "development" ? true : false,
        httpOnly: process.env.NODE_DEV == "development" ? true : false,
        sameSite: process.env.NODE_DEV == "development" ? true : false,
      })
      .send({
        success: true,
        message: "User Logout Successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in logout Api",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, country, city, phone, address } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (country) user.country = country;
    if (city) user.city = city;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    await user.save();
    res.status(200).send({
      success: true,
      message: "User profile Updated  Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updateProfile Api",
      error,
    });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      res.status(500).send({
        success: false,
        message: "Please Provide old or new password",
      });
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      res.status(500).send({
        success: false,
        message: "Invalid old password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Change Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in password-change Api",
      error,
    });
  }
};

export const updateUserPhotoController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const file = getDataUri(req.file);
    await cloudinary.v2.uploader.destroy(user.profileImage.public_id);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profileImage = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await user.save();

    res.status(200).send({
      success: true,
      message: "User Photo Uploaded Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in user-photo-upload Api",
      error,
    });
  }
};

// forgot password controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email || !answer || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const secureUser = await userModel.findOne({ email, answer });
    if (!secureUser) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    secureUser.password = newPassword;
    await secureUser.save();
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in forgot-password Api",
      error,
    });
  }
};
