import Seller from "../models/sellerModel.js";
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

    const seller = await Seller.findOne({ email });
    if (seller) {
        return res.status(400).json({ message: "Seller already exists" });
    }
    const newSeller = await Seller.create({ name: username, email, password: hashedPassword });

    const refreshToken = generateToken(newSeller._id, "30d");
    const accessToken = generateToken(newSeller._id, "1d");
    // store refresh token in db
    newSeller.refreshToken = refreshToken;
    await newSeller.save();

    // Set refresh token in HTTP-only cookie
    res
        .status(201)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: "User registered", user: newSeller, accessToken });
};

const getProfile = (req, res) => {
    // res.send("User profile endpoint");
    res.status(200).json({ user: req.seller });
};

export default { register, getProfile };