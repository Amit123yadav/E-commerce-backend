// get all products

import mongoose from "mongoose";
import productModel from "../model/productModel.js";
import { getDataUri } from "../utils/Features.js";
import cloudinary from "cloudinary";
export const getAllProductController = async (req, res) => {
  const { keyword, category } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const query = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }

    const products = await productModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit);

    const totalProducts = await productModel.countDocuments(query);

    if (!products.length) {
      res.status(404).send({
        success: false,
        message: "no product found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Fetch All Products Sucessfully",
      total: products.length,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all products api",
    });
  }
};

// top rated products
export const topRatedProductsController = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ ratings: -1 }).limit(3);
    if (!products.length) {
      res.status(404).send({
        success: false,
        message: "no product found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Fetch Top Rated Products Sucessfully",
      total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get top rated products api",
    });
  }
};

// get single Product

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      res.status(500).send({
        success: false,
        message: "no product found by this Id",
      });
    }
    res.status(200).send({
      success: true,
      message: "product fetch successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in get all products api",
    });
  }
};

// create product

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !description || !price || !stock) {
      return res.status(500).send({
        success: false,
        message: "Please provide all required deatils",
      });
    }

    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "Please provide image details",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      productImage: [image],
    });

    res.status(200).send({
      success: true,
      message: "Product Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create product api",
    });
  }
};

// update product

export const productUpdateController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    //  validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    const { name, description, price, stock, category } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    await product.save();
    res.status(200).send({
      success: true,
      message: "product updated successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in update product api",
    });
  }
};

// update product image
export const productImageUpdateController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    //  validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }

    //  validation
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    product.productImage.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "product image updated ",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in update product image api",
    });
  }
};

// delete product image
export const deleteProductImage = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    //  validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    const id = req.query.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    let isExist = -1;
    product.productImage.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExist = index;
    });
    if (isExist < 0) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    await cloudinary.v2.uploader.destroy(
      product.productImage[isExist].public_id,
    );
    product.productImage.splice(isExist, 1);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Image deleted ",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in delete product image api",
    });
  }
};

// delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    //  validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    for (let i = 0; i < product.productImage.length; i++) {
      cloudinary.v2.uploader.destroy(product.productImage[i].public_id);
    }

    await product.deleteOne();

    res.status(200).send({
      success: true,
      message: "Product Delete successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in delete product api",
    });
  }
};

// review product
export const reviewProductController = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString(),
    );
    if (alreadyReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      });
      product.numOfReviews = product.reviews.length;
    }
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(200).send({
      success: true,
      message: "review added successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in review product api",
    });
  }
};
