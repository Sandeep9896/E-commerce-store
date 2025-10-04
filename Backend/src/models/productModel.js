import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: {
            type: String,
            enum: ["Electronics", "Clothing", "Books", "Home", "Beauty", "Sports", "Toys", "Grocery", "Automotive", "Health", "Furniture"],
            required: true
        },
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
    },
    {
        timestamps: true,
    }
);



const Product = mongoose.model("Product", productSchema);

export default Product;
