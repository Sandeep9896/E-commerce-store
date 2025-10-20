
import { useState } from "react";
import Slider from "../components/Slider";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";


export default function ProductCarousel() {
    const Navigate = useNavigate();
    const dispatch=useDispatch();
    const categories = [
        { name: "Electronics Products", image: "/images/pb1.jpg" },
        { name: "Fashion Products", image: "/images/pb2.jpg" },
        { name: "Home Products", image: "/images/pb3.jpg" },
        { name: "Sports Products", image: "/images/pb4.jpg" },
    ];
    const Products = [
        { name: "TV", image: "tv.jpg", price: 20000 },
        { name: "Washing Machine", image: "washingMachine.png", price: 25000 },
        { name: "Refrigerator", image: "rf.webp", price: 30000 },
        { name: "Laptop", image: "laptop.avif", price: 40000 },
        { name: "Mobile", image: "phone.jpg", price: 15000 },
    ]
    const SlideProduct = [
        { id: 1, name: "Smart Watch", image: "p1.jpg", price: 5000 },
        { id: 2, name: "Headphones", image: "p2.jpg", price: 3000 },
        { id: 3, name: "Camera", image: "p3.jpg", price: 25000 },
    ]
    const [active, setActive] = useState(null);

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
        <div className=" container  mx-auto mt-5  min-h-[90vh]   ">
            <SearchBar className="mb-5" />
            {/* Slider Section */}
            <Slider products={SlideProduct} />


            <h2 className="text-2xl text-secondary  font-bold mt-5 text-center">Browse your categories</h2>

            {/* Categories Section */}
            <div className="flex gap-4 h-70 sm:h-100 overflow-x-auto px-4 mt-5 snap-x snap-mandatory scroll-smooth sm:justify-center">
                {categories.map((category) => (
                    <div
                        key={category.name}
                        className="bg-accent min-w-[60%] sm:min-w-[20%] max-w-[60%] sm:max-w-[20%] flex-shrink-0 snap-start rounded-lg p-4 shadow flex flex-col justify-between"
                    >
                        {/* Header */}
                        <div className="mb-2">
                            <h3 className="text-background sm:text-lg text-sm truncate font-semibold">
                                {category.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-background/80">
                                {category.description}
                            </p>
                        </div>

                        {/* Image */}
                        <div className="px-2">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-[120px] sm:h-[180px] object-cover rounded-md"
                            />
                        </div>

                        {/* Footer */}
                        <div className="mt-3 flex justify-center">
                            <button className="text-primary bg-background hover:text-secondary  w-full py-2 rounded-md font-medium sm:text-xl transition">
                                Browse Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl text-secondary  font-bold mt-5 text-center">  Products</h2>

            <div>


                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-2 p-4 mt-5">
                    {Products.map((product) => (
                        <div
                            key={product.name}
                            className="relative bg-accent rounded-lg border border-secondary shadow hover:shadow-lg transition-shadow flex flex-col group overflow-hidden"
                            onClick={() => setActive(active === product.name ? null : product.name)}
                        >
                            <div className="relative">
                                <img
                                    src={`/images/${product.image}`}
                                    alt={`Product ${product.name}`}
                                    className="w-full h-[120px] sm:h-[180px] object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                                />

                                <div
                                    className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 rounded-md ${active === product.name ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"
                                        }`}
                                >
                                    <button onClick={(e) => handleAddToCart(e, product)} className="bg-primary text-foreground hover:bg-secondary px-3 py-2 rounded-md text-sm sm:text-base font-medium transition">
                                        Add to Cart
                                    </button>
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
                        </div>
                    ))}
                </div>


                <button onClick={() => { Navigate('/products'); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="mt-4 block outline py-2 w-32 mx-auto text-secondary font-bold hover:bg-primary hover:text-background rounded-md">
                    Load More
                </button>

            </div>







        </div>
    )
}
