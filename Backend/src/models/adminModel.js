import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        role: { type: String, default: "admin" },
        refreshToken: { type: String, default: "", select: false },
    },
    {
        timestamps: true,
    }
);

adminSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;   // hide password
    delete ret.__v;        // hide __v if you want
    delete ret.refreshToken; // hide refreshToken
    return ret;
  }
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
