import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";

const uploadProduct = async (req, res) => {
    try {
        const formData = req.body;
        const seller = req.seller._id;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { productName, description, category, price, stock, featured } = formData;

        const imageData = req.files.map((file) => {
            return {
                url: file.path,
                public_id: file.filename
            };
        });

        const product = await Product.create({
            productName,
            description,
            category,
            price,
            seller,
            images: imageData,
            stock,
            featured: featured === 'true' // Convert string to boolean
        });

        // No need for product.save() - Product.create() already saves

        await Seller.findByIdAndUpdate(seller, { $push: { products: product._id } });

        return res.status(200).json({ message: "Product uploaded successfully", product });

    } catch (error) {
        console.error("Product upload error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const productPagination = async (req, res) => {
    try {
        const allProducts = await Product.find().populate('seller', 'name');
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const start = (page - 1) * limit;
        const end = start + limit;
        const products = allProducts.slice(start, end);

        return res.json({
            products,
            total: allProducts.length,
            totalPages: Math.ceil(allProducts.length / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Pagination error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const featuredProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ featured: true }).populate('seller', 'name');
        return res.status(200).json({ featuredProducts });
    } catch (error) {
        console.error("Fetching featured products error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


export default { uploadProduct, productPagination, featuredProducts };