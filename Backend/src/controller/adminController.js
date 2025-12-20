import Admin from "../models/adminModel.js";
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
    const user = await Admin.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = await Admin.create({ name: username, email, password: hashedPassword });

    const refreshToken = generateToken(newAdmin._id, "30d");
    const accessToken = generateToken(newAdmin._id, "1d");

    // store refresh token in db
    newAdmin.refreshToken = refreshToken;
    await newAdmin.save();

    // Set refresh token in HTTP-only cookie
    res
        .status(201)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: "User registered", user: newAdmin, accessToken });
};

const getProfile = (req, res) => {
    // res.send("User profile endpoint");
    res.status(200).json({ user: req.admin });
};

const approveFeatureRequest = async (req, res) => {
  const product = await Product.findById(req.params.id);
  product.isFeatured = true;
  product.featuredRequest = false;
  await product.save();

  res.json({ message: 'Product marked as featured' });
}

export default { register, getProfile ,approveFeatureRequest};
