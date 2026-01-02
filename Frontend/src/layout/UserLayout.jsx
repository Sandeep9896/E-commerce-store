import { useEffect, useState, useMemo, useCallback } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import api from "../api/api";
import { clearCart } from "../slices/cartSlice";
import AuthModal from "../components/AuthModal";
import { ShoppingCart, Menu, X, Home, Package, User, LogOut, LogIn, Mail, Facebook, Instagram, Twitter, Phone } from "lucide-react";


export default function UserLayout() {
  const dispatch = useDispatch();
  const location = useLocation();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartItemsCount = useSelector((state) => state.cart.cartItems.length);
  const user = useSelector((state) => state.auth.user?.role || "user");
  const [authOpen, setAuthOpen] = useState(false);
  let [loginpageactive, setLoginPageActive] = useState(false);
  
  useEffect(() => {
    if (location.pathname.startsWith("/login/user")) {
      setLoginPageActive(true);
    }
    else {
      setLoginPageActive(false);
    }
  }, [location.pathname]);

  const profilePath = useMemo(() => {
    return user === "seller" ? "/seller/profile" : "/user/profile";
  }, [user]);

  const navItems = useMemo(() => [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    {
      label: (
        <>
          Cart {cartItemsCount > 0 && <sup className="text-xs bg-white/30 p-1 rounded-full">{cartItemsCount}</sup>}
        </>
      ),
      path: "/cart"
    }, 
    { label: "Profile", path: profilePath },
  ], [cartItemsCount, profilePath]);

  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = useCallback((path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path),
    [location.pathname]
  );

  const handleNav = useCallback((path) => {
    navigate(path);
    setMobileOpen(false);
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (token) {
        await api.post("/auth/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("isLoggedIn");

      setTimeout(() => {
        dispatch(logout());
        dispatch(clearCart());
      }, 100);

      navigate("/login/user", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.clear();
      dispatch(logout());
      navigate("/login/user", { replace: true });
    }
  }, [dispatch, navigate]);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((o) => !o);
  }, []);

  const handleAuthToggle = useCallback(() => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      setAuthOpen(true);
    }
  }, [isLoggedIn, handleLogout]);

  const closeAuthModal = useCallback(() => {
    setAuthOpen(false);
  }, []);

  useEffect(() => {
    console.log("UserLayout - isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Modern Header */}
      <header className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl sm:text-2xl hover:opacity-90 transition-opacity"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span className="hidden sm:inline">ShopEase</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    aria-current={active ? "page" : undefined}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                      active
                        ? "bg-white/20 backdrop-blur-sm shadow-lg"
                        : "hover:bg-white/10 backdrop-blur-sm"
                    }`}
                  >
                    {item.path === "/" && <Home className="w-4 h-4" />}
                    {item.path === "/products" && <Package className="w-4 h-4" />}
                    {item.path === "/cart" && <ShoppingCart className="w-4 h-4" />}
                    {item.path === "/user/profile" && <User className="w-4 h-4" />}
                    {item.path === "/seller/profile" && <User className="w-4 h-4" />}
                    {item.label}
                  </button>
                );
              })}
            </nav>
            
            {/* Auth Button */}
            <button 
              disabled={loginpageactive} 
              onClick={handleAuthToggle}
              className="hidden sm:flex items-center gap-2 px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="w-5 h-5" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-white/20 bg-gradient-to-b from-brand-primary/95 to-brand-secondary/95 backdrop-blur-sm animate-fadeInUp">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 ${
                      active
                        ? "bg-white/20 backdrop-blur-sm shadow-lg"
                        : "hover:bg-white/10 backdrop-blur-sm"
                    }`}
                  >
                    {item.path === "/" && <Home className="w-4 h-4" />}
                    {item.path === "/products" && <Package className="w-4 h-4" />}
                    {item.path === "/cart" && <ShoppingCart className="w-4 h-4" />}
                    {item.path === "/user/profile" && <User className="w-4 h-4" />}
                    {item.path === "/seller/profile" && <User className="w-4 h-4" />}
                    {item.label}
                  </button>
                );
              })}
              <button
                onClick={handleAuthToggle}
                className="w-full text-left px-4 py-3 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center gap-2 mt-4"
                disabled={loginpageactive}
              >
                {isLoggedIn ? (
                  <>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Login
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <AuthModal open={authOpen} onClose={closeAuthModal} />
        <Outlet />
      </main>

      {/* Modern Premium Footer */}
      <footer className="bg-gradient-to-b from-brand-dark via-brand-dark to-black text-brand-light mt-16 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Brand Section */}
              <div className="animate-fadeInUp" style={{ animationDelay: '0ms' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingCart className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">ShopEase</h2>
                    <p className="text-xs text-brand-secondary">Premium Shopping</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-brand-light/70 mb-6">
                  Experience seamless shopping with premium products, exclusive deals, and exceptional customer service. Your satisfaction is our priority.
                </p>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 hover:from-brand-primary/40 hover:to-brand-secondary/40 transition-all duration-300 flex items-center justify-center group border border-brand-primary/10 hover:border-brand-primary/30">
                    <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 hover:from-brand-primary/40 hover:to-brand-secondary/40 transition-all duration-300 flex items-center justify-center group border border-brand-primary/10 hover:border-brand-primary/30">
                    <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 hover:from-brand-primary/40 hover:to-brand-secondary/40 transition-all duration-300 flex items-center justify-center group border border-brand-primary/10 hover:border-brand-primary/30">
                    <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Categories */}
              <div className="animate-fadeInUp" style={{ animationDelay: '50ms' }}>
                <h3 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-primary" />
                  Categories
                </h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-brand-light/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                    Men's Fashion
                  </a></li>
                  <li><a href="#" className="text-brand-light/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                    Women's Fashion
                  </a></li>
                  <li><a href="#" className="text-brand-light/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                    Electronics
                  </a></li>
                  <li><a href="#" className="text-brand-light/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                    Home & Living
                  </a></li>
                </ul>
              </div>

              {/* Support & Help */}
              <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-brand-primary" />
                  Support
                </h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-brand-light/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                    Contact Us
                  </a></li>
                  <li><a href="#" className="text-brand-light/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                    Help Center
                  </a></li>
                  <li><a href="#" className="text-brand-light/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                    Track Order
                  </a></li>
                  <li><a href="#" className="text-brand-light/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                    Return Policy
                  </a></li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="animate-fadeInUp" style={{ animationDelay: '150ms' }}>
                <h3 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-brand-primary" />
                  Newsletter
                </h3>
                <p className="text-sm text-brand-light/70 mb-4">Subscribe for exclusive deals and updates.</p>
                <div className="flex flex-col gap-3">
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-white placeholder-brand-light/40 focus:outline-none focus:border-brand-primary/50 focus:bg-brand-primary/20 transition-all"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-primary/0 to-brand-secondary/0 group-focus-within:from-brand-primary/5 group-focus-within:to-brand-secondary/5 transition-all pointer-events-none"></div>
                  </div>
                  <button className="px-4 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/25 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Divider with Gradient */}
            <div className="h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent my-12"></div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
              <div className="text-brand-light/60">
                <p>© {new Date().getFullYear()} <span className="font-semibold text-white">ShopEase</span>. All rights reserved.</p>
                <p className="mt-1 text-xs">Made with ❤️ for our customers</p>
              </div>
              <div className="flex flex-wrap gap-6 justify-center md:justify-end">
                <a href="#" className="text-brand-light/70 hover:text-brand-secondary transition-colors hover:underline decoration-brand-primary/50">Terms of Service</a>
                <a href="#" className="text-brand-light/70 hover:text-brand-secondary transition-colors hover:underline decoration-brand-primary/50">Privacy Policy</a>
                <a href="#" className="text-brand-light/70 hover:text-brand-secondary transition-colors hover:underline decoration-brand-primary/50">Cookie Policy</a>
                <a href="#" className="text-brand-light/70 hover:text-brand-secondary transition-colors hover:underline decoration-brand-primary/50">Sitemap</a>
              </div>
            </div>
          </div>

          {/* Top Stripe */}
          <div className="h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary opacity-30"></div>
        </div>
      </footer>
    </div>
  );
}
