import React, { useState } from "react";
import { Button } from "../components/ui/button"; // adjust import path if needed
import { Card } from "../components/ui/card";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Check, ChevronRight, Package, Info } from "lucide-react"; // for rating icons
import { useLocation, useParams } from "react-router-dom";
import api from "../api/api";
import { useEffect } from "react";
import useAddToCart from "../hooks/useAddToCart";
import HandleCheckOut from "../components/HandleCheckOut";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginAlertModal from "../components/LoginAlertModal";
import ProductSkeleton from "../components/ProductSkeleton";
import { useCallback } from "react";

const Product = () => {
  const location = useLocation();
  const { handleAddToCart, added } = useAddToCart();
  console.log("useAddToCart hook:", added);
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [opencheckout, setOpenCheckout] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const productFeatures = [
    { icon: Truck, text: "Free Delivery", subtext: "On orders over $50" },
    { icon: Shield, text: "Secure Payment", subtext: "100% protected" },
    { icon: RotateCcw, text: "Easy Returns", subtext: "30-day guarantee" },
  ];

  const fetchRelatedProducts = useCallback(async (category, productId) => {
    try {
      setLoadingRelated(true);
      const res = await api.get(`/users/related-products/${category}`);
      const filteredProducts = res.data.products.filter((p) => p._id !== productId);
      setRelatedProducts(filteredProducts);
      console.log("Fetched related products:", filteredProducts);
      console.log("Total related products:", filteredProducts.length);
    } catch (err) {
      console.error("Error fetching related products:", err);
    } finally {
      setLoadingRelated(false);
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

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [relatedProducts]);

  const handleBuy = () => {
    if (!user) {
      console.log("User not logged in, showing login modal");
      setShowLoginAlert(true);
    }
    else {
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
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Loading Product</h3>
          <p className="text-muted-foreground">Please wait while we fetch the details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-background to-muted/20 min-h-screen">
      <LoginAlertModal isOpen={showLoginAlert} onClose={() => setShowLoginAlert(false)} />

      {/* Breadcrumb */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate('/')} className="hover:text-brand-primary transition">
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <button onClick={() => navigate('/products')} className="hover:text-brand-primary transition">
              Products
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate">{product.productName}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">

          {/* Left: Product Images */}
          <div className="space-y-4 animate-fadeInUp">
            {/* Main Image */}
            <div className="relative group bg-background rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="aspect-square flex items-center justify-center p-8">
                <img
                  src={activeImage}
                  alt={product.productName}
                  className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Image Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${isWishlisted
                      ? 'bg-error text-white'
                      : 'bg-white/90 text-foreground hover:bg-error hover:text-white'
                    } shadow-lg hover:scale-110`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-foreground hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl p-2 min-w-[120px] animate-scaleIn">
                      <button className="w-full text-left px-4 py-2 hover:bg-muted rounded text-sm">Facebook</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-muted rounded text-sm">Twitter</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-muted rounded text-sm">Copy Link</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Badge */}
              {product.stock > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-success/90 text-white text-sm font-medium shadow-lg">
                    <Check className="w-4 h-4 mr-1" />
                    In Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img.url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${activeImage === img.url
                      ? "border-brand-primary shadow-lg ring-2 ring-brand-primary/20"
                      : "border-border hover:border-brand-primary/50"
                    }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            {/* Category Badge */}
            <div>
              <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
                {product.productName}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < (product.rating || 4)
                          ? "fill-warning text-warning"
                          : "text-muted-foreground/30"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating || 4.5} ({product.reviews || 128} reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-2xl p-6 border border-brand-primary/20">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-brand-primary">
                  ${product.price}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ${Math.round(product.price * 1.25)}
                </span>
                <span className="px-3 py-1 bg-error text-white rounded-full text-sm font-semibold">
                  -20%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Tax included. Shipping calculated at checkout.</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border-2 border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x-2 border-border font-semibold">
                  {selectedQuantity}
                </span>
                <button
                  onClick={() => setSelectedQuantity(Math.min(product.stock || 10, selectedQuantity + 1))}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock || 50} available
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="flex-1 group relative px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
              >
                {added ?
                  <span className="relative z-10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Added !
                  </span>
                  :
                  <span className="relative z-10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </span>
                }
                <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={handleBuy}
                className="flex-1 px-8 py-4 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {productFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <feature.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{feature.text}</p>
                    <p className="text-xs text-muted-foreground">{feature.subtext}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="bg-info/5 border border-info/20 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Product Information</p>
                <p>SKU: {product._id?.slice(-8).toUpperCase()}</p>
                <p>Category: {product.category}</p>
                {product.stock && <p>Stock: {product.stock} units available</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {(loadingRelated || relatedProducts.length > 0) && (
          <div className="animate-on-scroll opacity-0 transition-all duration-700" style={{ transform: 'translateY(20px)' }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                You May Also Like
              </h2>
              <p className="text-muted-foreground text-lg">
                Similar products you might be interested in
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {loadingRelated ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <ProductSkeleton key={`related-skeleton-${index}`} />
                ))
              ) : (
                relatedProducts.slice(0, 5).map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => handleSelectProduct(item)}
                  className="group relative bg-background rounded-2xl border border-border/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={item.images[0].url}
                      alt={item.productName}
                      className="w-full h-[180px] sm:h-[220px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay with Add to Cart */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="w-full py-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center"
                      >
                        {added ?
                          <span className="relative z-10 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Added !
                          </span>
                          :
                          <span className="relative z-10 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                          </span>
                        }
                      </button>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="text-sm font-semibold">4.5</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 truncate group-hover:text-brand-primary transition-colors">
                      {item.productName}
                    </h3>
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-brand-primary">
                          ${item.price}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${Math.round(item.price * 1.2)}
                        </span>
                      </div>
                      <div className="text-xs text-success mt-1 flex items-center">
                        <Package className="w-3 h-3 mr-1" />
                        In Stock
                      </div>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>

            {/* View More Button */}
            {relatedProducts.length > 5 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => navigate('/products', { state: { category: product.category } })}
                  className="group px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center"
                >
                  View More {product.category} Products
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
