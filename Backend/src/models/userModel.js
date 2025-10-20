// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      url: String,
      public_id: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hide password by default in queries
    },
    role: {
      type: String,
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String
    }
    ,
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    refreshToken: { type: String, default: "", select: false },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;   // hide password
    delete ret.__v;        // hide __v if you want
    delete ret.refreshToken; // hide refreshToken
    return ret;
  }
});



const User = mongoose.model("User", userSchema);
export default User;
