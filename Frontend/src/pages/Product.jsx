import React, { useState } from "react";
import { Button } from "../components/ui/button"; // adjust import path if needed
import { Card } from "../components/ui/card";
import { Star } from "lucide-react"; // for rating icons
import { useLocation, useParams } from "react-router-dom";
import api from "../api/api";
import { useEffect } from "react";
import useAddToCart from "../hooks/useAddToCart";
import HandleCheckOut from "../components/HandleCheckOut";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginAlertModal from "../components/LoginAlertModal";
import { useCallback } from "react";
const Product = () => {
  const location = useLocation();
  const handleAddToCart = useAddToCart();
  const { id } = useParams();
  const user= useSelector((state) => state.auth.user);
  const [opencheckout, setOpenCheckout] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchRelatedProducts = useCallback(async (category, productId) => {
  try {
    const res = await api.get(`/users/related-products/${category}`);
    setRelatedProducts(
      res.data.products.filter((p) => p._id !== productId)
    );
  } catch (err) {
    console.error(err);
  }
}, []);

   

  useEffect(() => {
  const stateProduct = location.state?.product;
  console.log("Location state product:", stateProduct, id);

  // 1️⃣ If product came from navigation state
  if (stateProduct && stateProduct._id === id) {
    setProduct(stateProduct);
    setActiveImage(stateProduct.images?.[0]?.url);
    return;
  }

  // 2️⃣ Otherwise fetch by ID
  setLoading(true);
  api
    .get(`/products/${id}`)
    .then((res) => {
      setProduct(res.data);
      setActiveImage(res.data.images?.[0]?.url);
    })
    .catch((err) => console.error("Error fetching product:", err))
    .finally(() => setLoading(false));
}, [id, location.state]);


  useEffect(() => {
  if (product?.category) {
    fetchRelatedProducts(product.category, product._id);
  }
}, [product, fetchRelatedProducts]);

  const handleBuy = () => {
    if(!user){
      console.log("User not logged in, showing login modal");
      setShowLoginAlert(true);
    }
    else{
      navigate("/user/checkout", { state: { product } });
    }
  }

  const handleSelectProduct = (product) => {
    console.log("Selected product:", product);
    // navigate to product details page if needed
    navigate(`/product/${product._id}`, { state: { product } });
  };

  if (loading || !product) {
    return (
      <div className="bg-background text-foreground min-h-screen px-6 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }




  return (
    <div className="bg-background text-foreground min-h-screen px-6 py-10">
      <LoginAlertModal isOpen={showLoginAlert} onClose={() => setShowLoginAlert(false)} />
      {/* Product Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Product Images */}
        <div className="flex flex-col gap-4">
          <div className="w-full h-[400px] bg-accent/10 rounded-lg flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.ProductName}
              className="object-contain w-full h-full rounded-lg"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                onClick={() => setActiveImage(img.url)}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${activeImage === img.url ? "border-primary" : "border-transparent"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center gap-5">
          <h1 className="text-2xl md:text-3xl font-bold">{product.productName}</h1>
          <p className="text-lg text-muted-foreground">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < product.rating ? "fill-primary text-primary" : "text-muted"
                  }`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              ({product.reviews} Reviews)
            </span>
          </div>

          {/* Price */}
          <h2 className="text-3xl font-semibold text-primary">
            ${product.price}
          </h2>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <Button className="bg-primary text-foreground hover:bg-secondary flex-1" onClick={(e) => handleAddToCart(e, product)}>
              Add to Cart
            </Button>
            <Button onClick={handleBuy} className="bg-accent text-background hover:bg-primary flex-1">
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Related Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedProducts.map((item) => (
            <Card
              key={item._id}
              className="bg-accent/90 hover:bg-accent transition rounded-lg shadow-sm hover:shadow-md overflow-hidden group"
              onClick={() => handleSelectProduct(item)}
            >
              <div className="relative">
                <img
                  src={item.images[0].url}
                  alt={item.productName}
                  className="w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button onClick={(e) => handleAddToCart(e, item)} className="bg-primary text-foreground hover:bg-secondary px-3 py-2 rounded-md">
                    Add To Cart
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-background text-sm font-semibold truncate">
                  {item.productName}
                </h3>
                <p className="text-background/80 text-sm">${item.price}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
