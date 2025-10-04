import express from "express";
import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";
import Admin from "../models/adminModel.js";
import { matchPassword } from "../utils/hashPassword.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const login = async (req, res) => {
    const { email, password, role } = req.body;

    let Model;
    if (role === "admin") Model = Admin;
    else if (role === "seller") Model = Seller;
    else if (role === "customer") Model = User;
    else return res.status(400).json({ message: "Invalid role" });

    const user = await Model.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: `${role} not found` });

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const refreshToken = generateToken(user._id, "30d");
    const accessToken = generateToken(user._id, "1d");
    user.refreshToken = refreshToken;
    await user.save();

    res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .json({ user, accessToken, role });
};


const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id).select("+refreshToken");
        if (!user) {
            user = await Seller.findById(decoded.id).select("+refreshToken");
        }
        if (!user) {
            user = await Admin.findById(decoded.id).select("+refreshToken");
        }

        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateToken(user._id, "15m");
        res.status(200).json({ message: "New access token generated", accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: " error Invalid refresh token" });
        throw new Error("Invalid refresh token", { cause: error });

    }
};

export default { login, refreshAccessToken };