import mongoose from "mongoose";


const sellerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        phone: { type: String, trim: true },
        address: [
            {
                fullName: String,

                street: String,
                city: String,
                state: String,
                postalCode: String,
            },
        ],
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        role: { type: String, default: "seller" },
        isVerified: { type: Boolean, default: false },
        refreshToken: { type: String, default: "", select: false },
    },
    {
        timestamps: true,
    }
);
sellerSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;   // hide password
    delete ret.__v;        // hide __v if you want
    delete ret.refreshToken; // hide refreshToken
    return ret;
  }
});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
