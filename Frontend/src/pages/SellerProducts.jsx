import { Input } from '../components/ui/input';
import React, { useCallback } from 'react'
import UploadProductModal from '../components/UploadProductModal';
import { useEffect } from 'react';
import api from '../api/api';
import { useSelector,useDispatch } from 'react-redux';
import { setSellerProducts } from '../slices/productSlice';
import FeaturedButton from '../components/ui/FeaturedButton';

const SellerProducts = () => {
  const dispatch = useDispatch();
  const sellerProducts = useSelector((state) => state.product.sellerProducts); 
  const [products, setProducts] = React.useState([]);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [editingProductId, setEditingProductId] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});

  // Memoize fetchProducts so it can be reused
  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get('/seller/products');
      setProducts(response.data.products || []);
      dispatch(setSellerProducts(response.data.products || []));
      console.log("Fetched products:", response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Function to handle successful upload
  const handleProductUploaded = () => {
    setShowUploadModal(false);
    fetchProducts(); // Refetch products after upload
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setEditForm(product);
  };

  const handleSave = useCallback(async (id) => {
    try {
      // Optional: Make API call to update product on backend
      // await api.put(`/products/${id}`, editForm);
      console.log("Saving product with ID:", id, "Data:", editForm);
      const res = await api.put(`/seller/products/${id}`, editForm);
      console.log("Product updated:", res.data.product);
      
      setProducts(products.map(p => 
        p._id === id ? { ...editForm } : p
      ));
      setEditingProductId(null);
      setEditForm({});
      
      // Refetch to ensure data consistency
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }, [editForm]);

  const handleCancel = () => {
    setEditingProductId(null);
    setEditForm({});
  };

  const handleChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  return (
    <>
      <button 
        onClick={() => setShowUploadModal(true)} 
        className="mt-4 mb-6 w-28 h-10 text-ellipsis text-[12px] sm:w-48 sm:h-10  absolute right-0 bg-green-500 text-white  py-2 rounded-full hover:bg-green-600"
      >
        Add New Product
      </button>
      <h1 className='text-2xl font-bold'>Products</h1>
      <p className='text-lg'>List of products.</p>
      
      {showUploadModal && (
        <UploadProductModal 
          setShowModal={setShowUploadModal}
          onSuccess={handleProductUploaded}
        />
      )} 

      <div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.length === 0 ? (
            <p className="text-gray-500 col-span-2 text-center">No products found. Add your first product!</p>
          ) : (
            products.map(product => {
              const isEditing = editingProductId === product._id;
              const currentProduct = isEditing ? editForm : product;

              return (
                <div key={product._id} className="border p-4 rounded-lg shadow-sm relative">
                  {!isEditing && (
                    <button 
                      onClick={() => handleEdit(product)} 
                      className="bg-primary text-foreground absolute right-0 top-0 px-4 py-2 rounded-full hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                  <img 
                    src={currentProduct.images?.[0]?.url || '/placeholder-image.jpg'} 
                    alt={currentProduct.name} 
                    className="w-100 h-100  rounded mb-4 object-cover" 
                  />

                  

                  {isEditing ? (
                    <>
                      <label htmlFor={`productName-${product._id}`} className="block mb-1 font-medium">Product Name</label>
                      <Input
                        id={`productName-${product._id}`}
                        placeholder="Product Name"
                        value={currentProduct.productName || ''}
                        onChange={(e) => handleChange('productName', e.target.value)}
                        className="mb-3"
                      />
                    </>
                  ) : (
                    <h2 className="text-lg font-semibold mb-2">{currentProduct.productName}</h2>
                  )}

                  {isEditing ? (
                    <>
                      <label htmlFor={`productDescription-${product._id}`} className="block mb-1 font-medium">Product Description</label>
                      <Input
                        id={`productDescription-${product._id}`}
                        placeholder="Product Description"
                        value={currentProduct.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="mb-3"
                      />
                    </>
                  ) : (
                    <p className="text-gray-600 mb-2">{currentProduct.description}</p>
                  )}

                  {isEditing ? (
                    <>
                      <label htmlFor={`productPrice-${product._id}`} className="block mb-1 font-medium">Product Price</label>
                      <Input 
                        id={`productPrice-${product._id}`}
                        type="number"
                        placeholder="Product Price"
                        value={currentProduct.price || ''}
                        onChange={(e) => handleChange('price', e.target.value)}
                        className="mb-3"
                      />
                    </>
                  ) : (
                    <p className="text-gray-800 font-bold mb-2">${currentProduct.price}</p>
                  )}

                  {isEditing ? (
                    <>
                      <label htmlFor={`productStock-${product._id}`} className="block mb-1 font-medium">Product Stock</label>
                      <Input 
                        id={`productStock-${product._id}`}
                        type="number"
                        placeholder="Product Stock"
                        value={currentProduct.stock || ''}
                        onChange={(e) => handleChange('stock', e.target.value)}
                        className="mb-3"
                      />
                    </>
                  ) : (
                    <p className="text-gray-600 mb-2">In Stock: {currentProduct.stock}</p>
                  )}

                  <p className="text-gray-600 mb-4">Sold: {currentProduct.sold || 0}</p>
                  
                  
                  {isEditing && (
                    <div className="absolute right-5 bottom-4 flex gap-2">
                      <button 
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSave(product._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  )}
                  <FeaturedButton productId={product._id} isFeatured={product?.featured} featuredRequest={product?.featuredRequest} />

                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default SellerProducts