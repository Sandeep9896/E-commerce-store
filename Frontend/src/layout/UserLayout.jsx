import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import api from "../api/api";
const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Cart", path: "/cart" },
  { label: "Profile", path: "/user/profile" },
];

export default function UserLayout() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      // ✅ Call backend logout endpoint if you have one
      if (token) {
        await api.post("/auth/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, // if using cookies
        });
      }

      // ✅ Clear localStorage data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("isLoggedIn");

      // ✅ Update Redux auth state
      dispatch(logout());

      // ✅ Redirect to login page
      navigate("/login/user", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout API fails, clear local data
      localStorage.clear();
      dispatch(logout());
      navigate("/login/user", { replace: true });
    }
  };

  useEffect(() => {
    console.log("UserLayout - isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col text-accent  ">
      <header className="p-4 border-b  flex items-center justify-between relative">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight"
        >
          🛒 E-Commerce
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
                  ? "bg-accent text-background shadow-sm"
                  : "text-foreground hover:bg-accent hover:text-background"
                  }`}
              >
                {item.label}
              </button>
            );
          })}

        </nav>
        <Button className={"hidden sm:flex   "} variant="outline" onClick={() => { isLoggedIn ? handleLogout() : handleNav("/login/user") }}>
          {isLoggedIn ? "Logout" : "Login"}
        </Button>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border  text-accent hover:bg-primary   "
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${mobileOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""
                }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${mobileOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
            />
          </div>
        </button>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="sm:hidden absolute top-full right-4 mt-2 w-40 bg-background border rounded-md shadow-lg overflow-hidden animate-in slide-in-from-top-2 z-50">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors ${active
                    ? "bg-primary text-foreground"
                    : "text-accent hover:bg-primary hover:text-foreground"
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => { isLoggedIn ? handleLogout() : handleNav("/login/user") }}
              className="block w-full text-left px-4 py-2 text-sm text-accent hover:bg-primary hover:text-foreground"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <footer className="bg-[#283618] text-[#fefae0] py-10 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#dda15e] mb-3">ShopEase</h2>
            <p className="text-sm leading-6 text-[#fefae0]/80">
              Your one-stop destination for quality products at unbeatable prices.
              Discover categories, browse, and shop with ease.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-[#dda15e] transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="hover:text-[#dda15e] transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="hover:text-[#dda15e] transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#dda15e]">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#bc6c25]">Men</a></li>
              <li><a href="#" className="hover:text-[#bc6c25]">Women</a></li>
              <li><a href="#" className="hover:text-[#bc6c25]">Kids</a></li>
              <li><a href="#" className="hover:text-[#bc6c25]">Accessories</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#dda15e]">Customer Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#bc6c25]">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#bc6c25]">FAQs</a></li>
              <li><a href="#" className="hover:text-[#bc6c25]">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-[#bc6c25]">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#dda15e]">Join Our Newsletter</h3>
            <p className="text-sm mb-3">Stay updated with our latest offers & products.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 rounded-md text-black focus:outline-none flex-1"
              />
              <button className="bg-[#dda15e] hover:bg-[#bc6c25] text-white px-4 py-2 rounded-md transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#fefae0]/20 mt-10 pt-4 text-center text-sm text-[#fefae0]/70">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
