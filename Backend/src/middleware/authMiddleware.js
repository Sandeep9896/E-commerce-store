// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";
import Admin from "../models/adminModel.js";

// common function
const protect = (Model, keyName) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, no token" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userData = await Model.findById(decoded.id).select("-password");
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      req[keyName] = userData;
      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  };
};

// create specialized middlewares
export const userProtect = protect(User, "user");
export const sellerProtect = protect(Seller, "seller");
export const adminProtect = protect(Admin, "admin");
