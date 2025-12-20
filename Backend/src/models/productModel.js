import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productName: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: {
            type: String,
            enum: ["Electronics", "Clothing", "Books", "Home", "Beauty", "Sports", "Toys", "Grocery", "Automotive", "Health", "furniture"],
            required: true
        },
        stock: { type: Number, required: true, default: 0 },
        sold: { type: Number, required: true, default: 0 },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
        },
        images: [
            {
                url: String,
                public_id: String,
            },
        ],
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                rating: { type: Number, required: true },
                comment: { type: String, required: true },
            },
        ],
        featured: { type: Boolean, default: false },
        featuredRequest: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

productSchema.index({ productName: "text", description: "text", category: "text" });

productSchema.index({ productName: 1, category: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
