import React from 'react'
import api from '../api/api';
import { useDispatch } from 'react-redux';

const UploadProductModal = ({ setShowModal, onSuccess }) => {
    const [formData, setFormData] = React.useState({});
    const fileInputRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(false);
    
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (files && files.length > 0) {
        setFormData({ ...formData, [name]: files[0] });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };
    
    const handleUpload = async (e) => {
      e.preventDefault();
      
      try {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('productName', formData.productName);
        uploadData.append('description', formData.description);
        uploadData.append('price', formData.price);
        uploadData.append('stock', formData.stock);
        uploadData.append('category', formData.category);
        
        if (formData.images) {
          uploadData.append('images', formData.images);
        }
        
        const res = await api.post('/products/upload', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log("Upload response:", res.data);
        
        // Call the success callback to refetch products
        if (onSuccess) {
          onSuccess();
        } else {
          setShowModal(false);
        }
        
      } catch (error) {
        console.error("Error uploading product:", error);
        alert("Failed to upload product. Please try again.");
      } finally {
        setUploading(false);
      }
    };
    
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Upload New Product
        </h2>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName || ''}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description || ''}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select name="category" id="category" value={formData.category || ''} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Beauty">Beauty</option>
              <option value="Sports">Sports</option>
              <option value="Toys">Toys</option>
              <option value="Grocery">Grocery</option>
              <option value="Automotive">Automotive</option>
              <option value="Health">Health</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product Images
            </label>
            <input
              type="file"
              name="images"
              ref={fileInputRef}
              onChange={handleChange}
              accept="image/*"
              required
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-400 file:text-white hover:file:bg-amber-500"
            />
            {formData.images && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {formData.images.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-2 mt-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Product'}
          </button>
        </form>

        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          onClick={() => setShowModal(false)}
          disabled={uploading}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default UploadProductModal