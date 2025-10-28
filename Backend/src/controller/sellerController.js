import Seller from "../models/sellerModel.js";
import generateToken  from "../utils/generateToken.js";
import { encryptPassword } from "../utils/hashPassword.js";
import deleteImageFromCloudinary from "../utils/deleteImageCloudinary.js";
import Product from "../models/productModel.js";

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
const uploadAvatar = async(req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        try {

            const imageData = {
                url: req.file.path,
                public_id: req.file.filename
            };
    
            console.log("imageData:", imageData);
            const user = await Seller.findById(req.seller._id);
            console.log("Current user:", user.avatar);
            deleteImageFromCloudinary(user?.avatar?.public_id);
            user.avatar = imageData;
            await user.save();

            res.status(200).json({ message: "Avatar uploaded successfully", url: req.file.path });
        }
        catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
            throw new Error("Server error", { cause: error });
        }
};

const updateProfile = async (req, res) => {
    try {
        // Get the form data from req.body
        console.log("Request body:", req.body); // Debug what's being received
        
        // Extract fields from whatever structure is sent
        // If you're sending the entire form object
        const formData = req.body;
        
        // Only allow specific fields to be updated (security best practice)
        const updateData = {};
        if (formData.name) updateData.name = formData.name;
        if (formData.phone) updateData.phone = formData.phone;
        if (formData.address) updateData.address = formData.address;
        // Don't allow email updates through this endpoint (would need verification)
        
        console.log("Update data:", updateData); // Debug what's being updated
        
        // Find and update in one step
        const user = await Seller.findByIdAndUpdate(
            req.seller._id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send response after successful update
        return res.status(200).json({ 
            success: true,
            message: "Profile updated successfully", 
            user 
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ 
            success: false,
            message: "Failed to update profile",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getProductsBySeller = async (req, res) => {
    try {
        const sellerId = req.seller._id;
        const products = await Product.find({ seller: sellerId });
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default { register, getProfile, uploadAvatar, updateProfile, getProductsBySeller };