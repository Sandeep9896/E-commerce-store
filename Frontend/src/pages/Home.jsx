
import { useEffect, useState, useRef } from "react";
import Slider from "../components/Slider";
import { useNavigate, Navigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import api from "../api/api";
import SuggestionBox from "../components/SuggestionBox";
import useAddToCart from "../hooks/useAddToCart";
import ProductSkeleton from "../components/ProductSkeleton";
import { ShoppingBag, TrendingUp, Users, Star, ArrowRight, Package, Truck, Shield, ChevronRight, ShoppingCart } from "lucide-react";


export default function ProductCarousel() {
    const { handleAddToCart, added } = useAddToCart();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const categoriesRef = useRef(null);

    const categories = [
        { name: "Electronics Products", image: "https://res.cloudinary.com/dxf4bombp/image/upload/v1767025202/pb1_qw9bw2.jpg", category: "Electronics", description: "Latest tech gadgets" },
        { name: "Fashion Products", image: "https://res.cloudinary.com/dxf4bombp/image/upload/v1767025233/pb2_ujnesm.jpg", category: "Clothing", description: "Trending styles" },
        { name: "Home Products", image: "https://res.cloudinary.com/dxf4bombp/image/upload/v1767025233/pb3_m9rwq4.jpg", category: "Furniture", description: "Modern living" },
        { name: "Sports Products", image: "https://res.cloudinary.com/dxf4bombp/image/upload/v1767025234/pb4_qutisy.jpg", category: "Sports", description: "Active lifestyle" },
    ];
    const [Products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const SlideProduct = [
        { id: 1, name: "Smart Watch", image: "https://res.cloudinary.com/dxf4bombp/image/upload/v1767024875/p1_kv7y3q.jpg", price: 5000 },
        { id: 2, name: "Headphones", image: "https://res.cloudinary.com/dxf4bombp/image/upload/v1767024876/p2_zqtfpc.jpg", price: 3000 },
        { id: 3, name: "Camera", image: "https://res.cloudinary.com/dxf4bombp/image/upload/v1767024877/p3_zhyz87.jpg", price: 25000 },
    ]
    const [active, setActive] = useState(null);

    const stats = [
        { icon: Package, value: "10K+", label: "Products", color: "text-brand-primary" },
        { icon: Users, value: "50K+", label: "Happy Customers", color: "text-success" },
        { icon: Star, value: "4.9", label: "Rating", color: "text-warning" },
        { icon: TrendingUp, value: "99%", label: "Satisfaction", color: "text-info" },
    ];

    const features = [
        { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
        { icon: Shield, title: "Secure Payment", description: "100% protected" },
        { icon: Package, title: "Easy Returns", description: "30-day guarantee" },
    ];

    //  const handleAddToCart = async(e, product) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     // Implement add to cart functionality here
    //     e.target.textContent = "Added!";
    //     setTimeout(() => {
    //       e.target.textContent = "Add to Cart";
    //     }, 500);

    //     dispatch(addToCart(product));
    //     console.log("Add to cart:", product);
    //     try {
    //         await
    //     api.post('/users/addToCart', {
    //         productId: product._id,
    //         quantity: 1
    //     });
    //     } catch (error) {
    //         console.error("Error adding to cart:", error);
    //     }
    // };
    const handleSearch = async (searchTerm) => {
        console.log("Searching for:", searchTerm);
        if (!searchTerm) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await api.get(`/users/search/${searchTerm}`);
            console.log("Search results:", response.data.products);
            setSuggestions(response.data.products);
            // navigate('/products', { state: { searchResults: response.data.products, searchTerm } });
        } catch (error) {
            console.error("Error searching products:", error);
        }
    };


    const handleSelectSuggestion = (product) => {
        console.log("Selected suggestion:", product);
        navigate(`/product/${product._id}`, { state: { product } });
        setSuggestions([]);
        setIsSearchFocused(false);
    }

    const handleSelectProduct = (product) => {
        console.log("Selected product:", product);
        // navigate to product details page if needed
        navigate(`/product/${product._id}`, { state: { product } });
    };
    useEffect(() => {
        // Cleanup suggestions when search is cleared
        if (!isSearchFocused) {
            setSuggestions([]);
        }
    }, [isSearchFocused]);

    const fetchFeaturedProducts = async () => {
        try {
            setLoadingProducts(true);
            const response = await api.get('/products/featured');
            console.log("Featured products:", response.data.featuredProducts);
            // Handle featured products as needed
            setProducts(response.data.featuredProducts);
        } catch (error) {
            console.error("Error fetching featured products:", error);
        } finally {
            setLoadingProducts(false);
        }
    };
    useEffect(() => {
        fetchFeaturedProducts();
        setIsVisible(true);

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('.animate-on-scroll');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);


    return (
        <div className="w-full bg-gradient-to-b from-background to-muted/20">

            {/* Hero Section */}
            <div className={`relative min-h-[80vh] flex items-center justify-center overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-brand-accent/5 to-brand-secondary/5" />
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        {/* Hero Content */}
                        <div className="text-center mb-12 space-y-6">
                            <div className="inline-block">
                                <span className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-4 animate-bounce">
                                    <Star className="w-4 h-4 mr-2" />
                                    New Arrivals Available
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                                Discover Your
                                <span className="block bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent animate-gradient">
                                    Perfect Style
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                                Shop the latest trends in electronics, fashion, and home decor.
                                Quality products at unbeatable prices.
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto mt-8">
                                <div className="relative">
                                    <SearchBar
                                        onSearch={handleSearch}
                                        onClear={() => setSuggestions([])}
                                        onFocusChange={setIsSearchFocused}
                                    />
                                    {isSearchFocused && (
                                        <SuggestionBox
                                            suggestions={suggestions}
                                            onSelect={handleSelectSuggestion}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                                <button
                                    onClick={() => { navigate('/products'); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                    className="group relative px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center">
                                        Shop Now
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>

                                <button
                                    onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                                >
                                    Browse Categories
                                </button>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 animate-on-scroll opacity-0">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/50"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-brand-primary/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-brand-secondary/20 rounded-full blur-3xl animate-float-delayed" />
            </div>

            {/* Features Section */}
            <div className="py-12 bg-background/50 animate-on-scroll opacity-0">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-6 bg-background rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border/50"
                            >
                                <div className="p-3 bg-brand-primary/10 rounded-full">
                                    <feature.icon className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div id="categories" className="py-16 container mx-auto px-4 animate-on-scroll opacity-0">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Browse by Category
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Explore our curated collections
                    </p>
                </div>

                <div className="flex gap-6 overflow-x-auto px-4 snap-x snap-mandatory scroll-smooth pb-4 sm:justify-center hide-scrollbar">
                    {categories.map((category, index) => (
                        <div
                            key={category.name}
                            className="group min-w-[280px] sm:min-w-[300px] max-w-[280px] sm:max-w-[300px] flex-shrink-0 snap-start"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/80 to-accent shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                    {/* Category Info Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-xl font-bold mb-1">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-white/80 mb-4">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Button */}
                                <div className="p-4">
                                    <button
                                        onClick={() => {
                                            navigate('/products', { state: { category: category.category } });
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}
                                        className="w-full py-3 bg-background text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group-hover:shadow-lg"
                                    >
                                        Explore Now
                                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Products Section */}
            <div className="py-16 bg-muted/30 animate-on-scroll opacity-0">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
                            Best Sellers
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Featured Products
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Handpicked items just for you
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {loadingProducts ? (
                            Array.from({ length: 15 }).map((_, index) => (
                                <ProductSkeleton key={`skeleton-${index}`} />
                            ))
                        ) : (
                            Products.map((product, index) => (
                                <div
                                    key={product._id}
                                    className="group relative bg-background rounded-2xl border border-border/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden cursor-pointer"
                                onClick={() => (setActive(active === product.productName ? null : product.productName), handleSelectProduct(product))}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Image Container */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.images[0].url}
                                        alt={product.productName}
                                        className="w-full h-[180px] sm:h-[220px] object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Overlay with Add to Cart */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-4 transition-all duration-300 ${active === product.productName ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"
                                            }`}
                                    >
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
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
                                        {product.productName}
                                    </h3>
                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-brand-primary">
                                                ${product.price}
                                            </span>
                                            <span className="text-sm text-muted-foreground line-through">
                                                ${Math.round(product.price * 1.2)}
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

                    {/* Load More Button */}
                    <div className="text-center mt-12">
                        <button
                            onClick={() => { navigate('/products'); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className="group px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center"
                        >
                            View All Products
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            {/* <div className="py-20 bg-gradient-to-br from-brand-primary to-brand-secondary animate-on-scroll opacity-0">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Stay Updated
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Subscribe to get special offers, free giveaways, and exclusive deals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-full text-foreground focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
                            />
                            <button className="px-8 py-4 bg-white text-brand-primary rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}
