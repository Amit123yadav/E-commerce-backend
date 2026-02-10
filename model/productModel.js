import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      required: [true, "Comment is Required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is Required"],
    },
    description: {
      type: String,
      required: [true, "prodcut description is Required"],
    },
    price: {
      type: String,
      required: [true, "Product price is Required"],
    },
    stock: {
      type: Number,
      required: [true, "Product Stock is Required"],
    },
    // quantity: {
    //   type: Number,
    //   required: [true, "Product quantity is Required"],
    // },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    productImage: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    reviews: [reviewSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
