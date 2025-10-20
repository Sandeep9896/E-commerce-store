import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import Slider from "../components/Slider";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const ITEMS_PER_PAGE = 8;

const ProductPage = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const [active, setActive] = useState(null);


  const fetchProducts = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/products?page=${pageNum}&limit=${ITEMS_PER_PAGE}`
      );

      const newProducts = res.data.products;
      console.log(res)
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
  }, []);

  const handleLoadMore = () => {
    fetchProducts(page + 1, true);
  };

  const handlePageChange = (num) => {
    fetchProducts(num, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement add to cart functionality here
    e.target.textContent = "Added!";
    setTimeout(() => {
      e.target.textContent = "Add to Cart";
    }, 500);

    dispatch(addToCart(product));
    console.log("Add to cart:", product);
  };

  return (
    <div className="min-h-screen container mx-auto bg-background px-4 py-8 text-foreground">

      <div className="max-w-6xl mx-auto">
        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="relative group overflow-hidden bg-accent rounded-lg border border-secondary shadow hover:shadow-lg transition-all"
              onClick={() => setActive(active === product._id ? null : product._id)}
            >
              <div className="relative">
                <img
                  src={`${product.images[0].url}`} // Assuming images is an array of image URLs
                  alt={product.name}
                  className="w-full h-[120px] sm:h-[220px] object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div
                  className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 rounded-md ${active === product._id ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"
                    }`}
                >
                  <Button onClick={(e) => handleAddToCart(e, product)} className="bg-primary text-foreground hover:bg-secondary text-sm font-medium px-3 py-2 rounded-md">
                    Add to Cart
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1 px-3 pb-2 pt-2">
                <h3 className="text-base text-background sm:text-lg font-semibold truncate">
                  {product.name}
                </h3>
                <p className="text-sm sm:text-base font-medium text-background">
                  Price: ${product.price}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mt-5">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Load More Button */}
        {loadMore && !loading && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleLoadMore}
              className="bg-primary text-foreground hover:bg-secondary px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
            >
              Load More
            </Button>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md border text-sm ${page === i + 1
                ? "bg-primary text-foreground border-primary"
                : "border-secondary hover:bg-secondary/50"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div >
  );
};

export default ProductPage;
