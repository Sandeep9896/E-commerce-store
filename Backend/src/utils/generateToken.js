// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (id, expiry) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expiry || "30d", // token valid for 30 days
  });
};

export default generateToken;
