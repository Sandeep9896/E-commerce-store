import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";

const uploadProduct = async (req, res) => {

    const { title, description, category, price, seller, } = req.body;

    if (!req.files) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    try {

        const imageData = req.files.map((file) => {
            return {
                url: file.path,
                public_id: file.filename
            };
        });

        console.log("imageData:", imageData);
        const product = await Product.create({ title, description, category, price, seller, images: imageData });
        await product.save();
        // res.send("Product upload endpoint");
        await Seller.findByIdAndUpdate(seller, { $push: { products: product._id } });

        res.status(200).json({ message: "Product uploaded", product });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        throw new Error("Server error", { cause: error });
    }
};

const productPagination = async (req, res) => {
    const allProducts = await Product.find().populate('seller', 'name');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const start = (page - 1) * limit;
    const end = start + limit;
    const products = allProducts.slice(start, end);

    res.json({
        products,
        total: allProducts.length,
        totalPages: Math.ceil(allProducts.length / limit),
        currentPage: page,
    });
}
export default { uploadProduct, productPagination };
