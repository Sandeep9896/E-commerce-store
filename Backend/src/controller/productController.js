import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";
import redisClient from "../config/redis.js";

const uploadProduct = async (req, res) => {
    try {
        const formData = req.body;
        const seller = req.seller._id;
        const key = "products:version";
        const exists = await redisClient.exists(key);

        


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

        // Invalidate cache
        await redisClient.del('featured_products');
        
        if (!exists) {
             await redisClient.set(key, 2, { EX: 3600 }); // Set initial version to 2 because default version key  is 1 and set with 1 hour expiry
        } else {
            await redisClient.incr(key);
        }        return res.status(200).json({ message: "Product uploaded successfully", product });

    } catch (error) {
        console.error("Product upload error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const productPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const version = await redisClient.get("products:version") || 1;

        const cacheKey = `products:v${version}:page:${page}:limit:${limit}`;
        // Check cache first
        const cachedProducts = await redisClient.get(cacheKey);
        if (cachedProducts) {
            console.log('Returning cached products');
            return res.json(JSON.parse(cachedProducts));
        }

        const allProducts = await Product.find().populate('seller', 'name');
        const start = (page - 1) * limit;
        const end = start + limit;
        const products = allProducts.slice(start, end);

        const response = {
            products,
            total: allProducts.length,
            totalPages: Math.ceil(allProducts.length / limit),
            currentPage: page,
        };

        // Cache for 1 hour (3600 seconds)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));

        return res.json(response);
    } catch (error) {
        console.error("Pagination error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const featuredProducts = async (req, res) => {
    try {
        const cacheKey = 'featured_products';

        // Check cache first
        const cachedFeatured = await redisClient.get(cacheKey);
        if (cachedFeatured) {
            console.log('Returning cached featured products');
            return res.status(200).json(JSON.parse(cachedFeatured));
        }

        const featuredProducts = await Product.find({ featured: true }).populate('seller', 'name');
        const response = { featuredProducts };

        // Cache for 1 hour (3600 seconds)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));

        return res.status(200).json(response);
    } catch (error) {
        console.error("Fetching featured products error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('seller', 'name');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }   
        return res.status(200).json({ product });
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


export default { uploadProduct, productPagination, featuredProducts, getProductById };