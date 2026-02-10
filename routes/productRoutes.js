import express from "express";
import {
  createProductController,
  deleteProduct,
  deleteProductImage,
  getAllProductController,
  getSingleProductController,
  productImageUpdateController,
  productUpdateController,
  reviewProductController,
  topRatedProductsController,
} from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middleware/Authorization.js";
import { singleStorage } from "../middleware/multer.js";
const router = express.Router();

// get all products
router.get("/get-all", getAllProductController);

// top rated products

router.get("/top-rated", topRatedProductsController)

// get single product
router.get("/:id", getSingleProductController);

// create product
router.post("/create", isAuth, isAdmin, singleStorage, createProductController);

// update product
router.put("/:id", isAuth, isAdmin, productUpdateController);

// update product image
router.put(
  "/image/:id",
  isAuth,
  isAdmin,
  singleStorage,
  productImageUpdateController,
);

// delete product image
router.delete(
  "/delete-image/:id",
  isAuth,
  isAdmin,
  singleStorage,
  deleteProductImage,
);

// delete product
router.delete("/delete/:id", isAuth, isAdmin, singleStorage, deleteProduct);

// review product

router.post("/review/:id" , isAuth, reviewProductController)

export default router;
