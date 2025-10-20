import User from "../models/userModel.js";
import deleteImageFromCloudinary from "../utils/deleteImageCloudinary.js";
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
        const user = await User.findByIdAndUpdate(
            req.user._id, 
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
            const user = await User.findById(req.user._id);
            console.log("Current user:", user.avatar);
            deleteImageFromCloudinary(user.avatar?.public_id);
            user.avatar = imageData;
            await user.save();

            res.status(200).json({ message: "Avatar uploaded successfully", url: req.file.path });
        }
        catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
            throw new Error("Server error", { cause: error });
        }
};

      

export default { register, getProfile, updateProfile, uploadAvatar };