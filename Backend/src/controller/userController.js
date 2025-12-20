import User from "../models/userModel.js";
import deleteImageFromCloudinary from "../utils/deleteImageCloudinary.js";
import generateToken  from "../utils/generateToken.js";
import { encryptPassword } from "../utils/hashPassword.js";
import Razorpay from "razorpay";
import Product from "../models/productModel.js";
import redisClient from "../config/redis.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

const getProfile = async (req, res) => {
    try {
        const cacheKey = `user_profile_${req.user._id}`;
        
        // Check cache first
        const cachedProfile = await redisClient.get(cacheKey);
        if (cachedProfile) {
            console.log('Returning cached user profile');
            return res.status(200).json({ user: JSON.parse(cachedProfile) });
        }

        // Cache for 30 minutes (1800 seconds)
        await redisClient.setEx(cacheKey, 1800, JSON.stringify(req.user));
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(200).json({ user: req.user });
    }
};

const updateProfile = async (req, res) => {
    try {
        // Get the form data from req.body
        // Extract fields from whatever structure is sent
        // If you're sending the entire form object
        const formData = req.body;
        
        // Only allow specific fields to be updated (security best practice)
        const updateData = {};
        if (formData.name) updateData.name = formData.name;
        if (formData.phone) updateData.phone = formData.phone;
        if (formData.address) updateData.address = formData.address;
        // Don't allow email updates through this endpoint (would need verification)
        
        // Find and update in one step
        const user = await User.findByIdAndUpdate(
            req.user._id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Invalidate cache
        const cacheKey = `user_profile_${req.user._id}`;
        await redisClient.del(cacheKey);

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
    
            const user = await User.findById(req.user._id);
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
const createOrder = async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // amount in paise
    currency: "INR",
    receipt: "order_rcpt_11"
  };

  try {
    const order = await razorpay.orders.create(options);
    res.send(order);
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("Current cart:", user.cart, "Adding product:", productId, "Quantity:", quantity);
        const existingCartItemIndex = user.cart.findIndex(item => item?.product?.toString() === productId);
        if (existingCartItemIndex >= 0) {
            user.cart[existingCartItemIndex].quantity += quantity;
            console.log("Updated quantity for existing cart item");
        } else {
            user.cart.push({ product: productId, quantity });
            console.log("Added new item to cart");
        }
        await user.save();
        res.status(200).json({ message: "Product added to cart", cart: user.cart });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();
        res.status(200).json({ message: "Product removed from cart", cart: user.cart });
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.cart = [];
        await user.save();
        res.status(200).json({ message: "Cart cleared", cart: user.cart });
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        console.log("Update cart request for product:", productId, "to quantity:", quantity);
        const user = await User.findById(req.user._id); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        cartItem.quantity = quantity;
        await user.save();
        res.status(200).json({ message: "Cart updated", cart: user.cart });
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const searchProducts = async (req, res) => {
    try {
        const {  query } = req.params;
        console.log("Searching products with query:", query, req.params, req.query);
        if (!query) {
            return res.status(400).json({ message: "Query parameter 'query' is required" });
        }
        const products = await Product.find({ productName: { $regex: `^${query}`, $options: "i" } });
        res.status(200).json({ products });
    } catch (error) {
        console.error("Search products error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export default { register, getProfile, updateProfile, uploadAvatar, createOrder, addToCart, getCart, removeFromCart, clearCart, updateCart, searchProducts };