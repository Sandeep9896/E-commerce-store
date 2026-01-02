import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAddToCart from "../hooks/useAddToCart";
import { ShoppingCart, Star, Package, Filter, Grid3x3, List, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";

const ITEMS_PER_PAGE = 12;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const [active, setActive] = useState(null);
  const location = useLocation();
  const { category, searchResults, searchTerm } = location.state || { category: "allProducts" };
  const [selectedCategory, setSelectedCategory] = useState(category || "allProducts");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("featured");
  const { handleAddToCart: addToCart, added } = useAddToCart();

  // 🔹 Fetch Products
  const fetchProducts = async (pageNum = 1, append = false) => {
    console.log("Fetching products for page:", pageNum, "Category:", selectedCategory);
    try {
      setLoading(true);
      const res = await api.get(
        `/products?page=${pageNum}&limit=${ITEMS_PER_PAGE}&category=${selectedCategory === "allProducts" ? "" : selectedCategory
        }`
      );

      const newProducts = res.data.products;
      console.log("Fetched products:", newProducts);

      setProducts((prev) => (append ? [...prev, ...newProducts] : newProducts));
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
      setLoadMore(pageNum < res.data.totalPages);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, false);
  }, [selectedCategory]);

  // 🔹 Load More Pagination
  const handleLoadMore = () => {
    fetchProducts(page + 1, true);
  };

  // 🔹 Manual Page Change
  const handlePageChange = (num) => {
    fetchProducts(num, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Add to Cart
  // const handleAddToCart = async (e, product) => {
  //   e.preventDefault();
  //   console.log("Adding to cart:", product);
  //   addToCart(e, product);

  // };

  // 🔹 Category Filter Logic
  // const filteredProducts = useMemo(() => (
  //   selectedCategory === "allProducts"
  //     ? products
  //     : products.filter((product) => product.category === selectedCategory)
  // ), [products, selectedCategory]);

  const handleSelectProduct = (product) => {
    console.log("Selected product:", product);
    // navigate to product details page if needed
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {searchTerm ? `Search Results for "${searchTerm}"` : selectedCategory === "allProducts" ? "All Products" : selectedCategory}
            </h1>
            <p className="text-lg text-white/90">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and View Controls */}
        <div className="mb-8 bg-background rounded-2xl shadow-lg border border-border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Left: Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Filter className="w-5 h-5 text-brand-primary" />
                <span>Filters:</span>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger className="w-[180px] border-2 hover:border-brand-primary transition-colors">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="allProducts">All Products</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  <SelectItem value="Toys">Toys</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="w-[180px] border-2 hover:border-brand-primary transition-colors">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right: View Toggle */}
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${viewMode === "grid"
                    ? "bg-brand-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list"
                    ? "bg-brand-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid/List */}
        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6"
            : "flex flex-col gap-4"
          }>
            {products.map((product, index) => (
              <div
                key={product._id}
                onClick={() => {
                  setActive(active === product._id ? null : product._id);
                  handleSelectProduct(product);
                }}
                className={`group relative bg-background rounded-2xl border border-border/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer animate-fadeInUp ${viewMode === "list" ? "flex flex-row" : "flex flex-col"
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                  <img
                    src={product.images[0].url}
                    alt={product.productName}
                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${viewMode === "list" ? "w-full h-full" : "w-full h-[180px] sm:h-[240px]"
                      }`}
                  />

                  {/* Overlay with Add to Cart */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-4 transition-all duration-300 ${active === product._id ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"
                      }`}
                  >
                    <button
                      onClick={(e) => addToCart(e, product)}
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

                  {/* Stock Badge */}
                  {product.stock > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2 py-1 bg-success text-white text-xs font-medium rounded-full">
                        In Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className={`p-4 flex flex-col ${viewMode === "list" ? "flex-grow justify-center" : ""}`}>
                  <h3 className={`font-semibold text-foreground mb-2 group-hover:text-brand-primary transition-colors ${viewMode === "list" ? "text-xl" : "text-base sm:text-lg truncate"
                    }`}>
                    {product.productName}
                  </h3>

                  {viewMode === "list" && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-bold text-brand-primary ${viewMode === "list" ? "text-2xl" : "text-xl"}`}>
                        ${product.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${Math.round(product.price * 1.2)}
                      </span>
                    </div>
                    <div className="text-xs text-success mt-1 flex items-center">
                      <Package className="w-3 h-3 mr-1" />
                      {product.stock || 50} available
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && products.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {loadMore && !loading && products.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="group px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center"
            >
              Load More Products
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border-2 border-border hover:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${page === pageNum
                        ? "bg-brand-primary text-white shadow-lg scale-110"
                        : "border-2 border-border hover:border-brand-primary hover:text-brand-primary"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border-2 border-border hover:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
