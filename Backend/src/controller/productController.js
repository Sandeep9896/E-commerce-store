import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";

const uploadProductImage = async (req, res) => {

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

export default { uploadProductImage };
