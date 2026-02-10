import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import Stripe from "stripe";
// Configure dotenv
dotenv.config();

// Connect to database
connectDB();

// Initialize Stripe

export const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize express app
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

// All routes
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

app.use("/api/v1", testRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/order", orderRoutes);
app.get("/test", (req, res) => {
  res.status(200).send("<h1>Welcome to the Backend APi Server</h1>");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`.bgMagenta.white);
});
