import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";

// user Authentication middleware
export const isAuth = async (req, res, next) => {
  const { token } = await req.cookies;
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "unAuthorized User",
    });
  }
  const decodeUser = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodeUser._id);
  next();
};


// admin Authorization middleware
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({
      success: false,
      message: "Forbidden Access - Admins only",
    });
  }
  next();
};
