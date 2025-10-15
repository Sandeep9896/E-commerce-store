import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { Button } from "../components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import api from "../api/api";

export default function SellerLayout({children}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const seller = useSelector((state) => state.auth.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Sidebar navigation items
  const navItems = [
    { label: "Dashboard", path: "/seller", icon: <LayoutDashboard size={18} /> },
    { label: "Products", path: "/seller/products", icon: <Package size={18} /> },
    { label: "Orders", path: "/seller/orders", icon: <ShoppingBag size={18} /> },
    { label: "Profile", path: "/seller/profile", icon: <User size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  // ✅ Logout function (works with backend)
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        "/auth/logout",
        {},
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          withCredentials: true,
        }
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("isLoggedIn");

      dispatch(logout());
      navigate("/login/seller", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      dispatch(logout());
      navigate("/login/seller", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 fixed sm:static inset-y-0 left-0 w-64 bg-primary text-foreground transition-transform duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary-foreground/30">
          <h2 className="text-xl font-bold tracking-tight">Seller Panel</h2>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-secondary text-primary-foreground"
                  : "hover:bg-secondary/50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-primary-foreground/30 p-4">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            disabled={isLoggingOut}
          >
            <LogOut size={16} />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-background border-b p-4 shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="sm:hidden p-2 border rounded-md"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold">Welcome, {seller?.name || "Seller"}</h1>
          </div>
          <Link
            to="/"
            className="text-sm text-primary hover:underline"
          >
            Go to Storefront →
          </Link>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 bg-background overflow-y-auto">
            {children || <Outlet />}
        </main>

        {/* Footer */}
        <footer className="text-center text-xs py-3 border-t text-muted-foreground">
          © {new Date().getFullYear()} Seller Dashboard — All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}
