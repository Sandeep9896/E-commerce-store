import User from "../models/userModel.js";
import generateToken  from "../utils/generateToken.js";
import { encryptPassword } from "../utils/hashPassword.js";

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const register = async (req, res) => {
    // res.send("Register endpoint");
    const { username, email, password } = req.body;

    const hashedPassword = await encryptPassword(password);
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name: username, email, password: hashedPassword });

    const refreshToken = generateToken(newUser._id, "30d");
    const accessToken = generateToken(newUser._id, "1d");
    // store refresh token in db
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Set refresh token in HTTP-only cookie
    res
        .status(201)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: "User registered", user: newUser, accessToken });
};

const getProfile = (req, res) => {
    // res.send("User profile endpoint");
    res.status(200).json({ user: req.user });
};

export default { register, getProfile };