import express from "express";
import { isAdmin, isAuth } from "../middleware/Authorization.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

// create category
router.post("/create", isAuth, isAdmin, createCategoryController);

// get all categories
router.get("/get-all", getAllCategoryController);

// update category
router.put("/update/:id", isAuth, isAdmin, updateCategoryController);

// update category
router.delete("/:id", isAuth, isAdmin, deleteCategoryController);

export default router;
