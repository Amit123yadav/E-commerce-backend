import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      required: [true, "Please provide a password"],
    },
    address: {
      type: String,
      required: [true, "Please provide an address"],
    },
    city: {
      type: String,
      required: [true, "Please provide a city"],
    },
    country: {
      type: String,
      required: [true, "Please provide a country"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    profileImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    answer:{
      type : String,
      required : [true , "Please provide an answer for security question"]
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true },
);

// encrypt password before saving to database
// hash password before saving to database

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// comparepassword
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// authorization
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default mongoose.model("User", userSchema);
