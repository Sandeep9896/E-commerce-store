import cloudinary from "../config/cloudinary.js";

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

export default deleteImageFromCloudinary;
