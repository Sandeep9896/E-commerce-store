import React, { use, useState } from "react";
import { Button } from "../components/ui/button"; // shadcn UI button (or your own)
import { Trash2, ShoppingBag, Minus, Plus, ArrowRight, Gift, Truck, Shield, Tag, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import handleRazorpayPayment from "../components/handleRazorpayPayment";
import api from "../api/api";
import HandleCheckOut from "../components/HandleCheckOut";
import { setCartItems } from '../slices/cartSlice'
import LoginAlertModal from "../components/LoginAlertModal";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { clearCart } from "../slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const isloggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const [address, setAddress] = useState(user?.address || "");
  let [cart, setCart] = useLocalStorage("cart", []);
  const hasMergedRef = React.useRef(false);
  
  useEffect(() => {
    setAddress(user?.address || "");
  }, [user]);

  useEffect(() => {
    const initializeCart = async () => {
      if (isLoggedIn) {
        // User is logged in
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Only merge if we have local items AND haven't merged yet
        if (localCart.length > 0 && !hasMergedRef.current) {
          console.log("Merging guest cart with server cart...");
          hasMergedRef.current = true;
          
          try {
            // Format local cart items to match backend expectations
            const formattedCart = localCart.map(item => ({
              _id: item._id,
              quantity: item.quantity
            }));

            await api.post("/users/cart-merge", {
              cartItems: formattedCart
            });

            // ✅ Clear localStorage immediately after successful merge
            localStorage.removeItem("cart");
            console.log("Cart merged and localStorage cleared");
          } catch (error) {
            console.error("Cart merge failed:", error);
            hasMergedRef.current = false; // Allow retry on error
          }
        }
        
        // Fetch cart from server (whether we merged or not)
        try {
          const response = await api.get("/users/cart");
          const serverCart = response.data?.cart || [];

          const normalizedItems = serverCart.map(item => ({
            _id: item.product._id,
            productName: item.product.productName,
            price: item.product.price,
            image: item.product.images?.[0]?.url,
            quantity: item.quantity
          }));

          dispatch(setCartItems(normalizedItems));
        } catch (error) {
          console.error("Error fetching cart:", error);
          dispatch(setCartItems([]));
        } finally {
          setLoading(false);
        }
      } else {
        // Guest user → load only localStorage cart
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        dispatch(setCartItems(localCart));
        setLoading(false);
        // Reset merge flag when logged out
        hasMergedRef.current = false;
      }
    };

    initializeCart();
  }, [isLoggedIn, dispatch]);


  const handleQuantityChange = async (item) => {
    dispatch(addToCart(item));

    // Keep localStorage in sync for guests only
    if (!isLoggedIn) {
      const updatedCart = cart.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
      return; // Don't call server API for guests
    }

    // For logged-in users, update server cart
    try {
      await api.put('/users/updateCart', {
        productId: item._id,
        quantity: item.quantity + 1
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemove = async (item, deletedItem = false) => {
    dispatch(removeFromCart({ item, deletedItem }));

    // Keep localStorage in sync for guests only
    if (!isLoggedIn) {
      const updatedCart = deletedItem || item.quantity === 1
        ? cart.filter((cartItem) => cartItem._id !== item._id)
        : cart.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          );
      setCart(updatedCart);
      return; // Don't call server API for guests
    }

    // For logged-in users, update server cart
    if (deletedItem || item.quantity === 1) {
      try {
        await api.delete(`/users/cart/${item._id}`);
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
      return;
    }

    try {
      await api.put('/users/updateCart', {
        productId: item._id,
        quantity: item.quantity - 1
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const [open, setOpen] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // Validate before checkout if logged in then open address confirm modal else show login alert

  const handleValidate = () => {
    console.log("Validating checkout details...");
    if (isloggedIn) {
      navigate("/user/checkout");
    }
    else {
      setShowLoginAlert(true);
    }

  }

  const handleClearCart = async () => {
    dispatch(clearCart());
    if (!isLoggedIn) {
      setCart([]);
      return;
    }
    try {
      await api.delete('/users/cart');
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Proceed to payment handler and it call from address confirm modal, it will call razorpay payment gateway
  
  // callback function after payment successfull
 
  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Loading Your Cart</h3>
          <p className="text-muted-foreground">Please wait while we fetch your items...</p>
        </div>
      </div>
    );
  }

 

  if (cartItems.length === 0) {
    return (
      <div className="bg-gradient-to-b from-background to-muted/20 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="animate-fadeInUp">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-brand-primary" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md">
            Looks like you haven't added anything to your cart yet.
            Start shopping and discover amazing products!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <button className="group px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center">
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/products">
              <button className="px-8 py-4 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl font-semibold text-lg transition-all duration-300">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-background to-muted/20 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center">
                <ShoppingBag className="mr-3 w-10 h-10" />
                Shopping Cart
              </h1>
              <p className="text-white/90 text-lg">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <button
              onClick={handleClearCart}
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 border border-white/20"
            >
              <Trash2 className="w-5 h-5" />
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Features Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 bg-background rounded-xl p-4 border border-border shadow-sm">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Free Delivery</p>
              <p className="text-xs text-muted-foreground">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-background rounded-xl p-4 border border-border shadow-sm">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Secure Payment</p>
              <p className="text-xs text-muted-foreground">100% protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-background rounded-xl p-4 border border-border shadow-sm">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Gift className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Special Offers</p>
              <p className="text-xs text-muted-foreground">Save on bulk orders</p>
            </div>
          </div>
        </div>
      {
        open && <HandleCheckOut
          isOpen={open}
          onClose={() => setOpen(false)}
          address={address}
          phone={user?.phone || ""}
          onProceed={handleProceed}
          onChangeAddress={() => console.log("Change address clicked")}
        />
      }

        {/* Cart Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={item._id}
                className="group bg-background rounded-2xl border border-border hover:border-brand-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {/* Stock Badge */}
                      <div className="absolute -top-2 -right-2 bg-success text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                        In Stock
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg sm:text-xl text-foreground mb-1 group-hover:text-brand-primary transition-colors">
                            {item.productName}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl font-bold text-brand-primary">
                              ${item.price}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${Math.round(item.price * 1.2)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item, true)}
                          className="p-2 hover:bg-error/10 rounded-lg transition-colors group/delete"
                        >
                          <X className="w-5 h-5 text-muted-foreground group-hover/delete:text-error transition-colors" />
                        </button>
                      </div>

                      {/* Quantity and Total */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                          <div className="flex items-center border-2 border-border rounded-lg overflow-hidden bg-muted/30">
                            <button
                              onClick={() => handleRemove(item)}
                              disabled={item.quantity <= 1}
                              className="px-4 py-2 hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-6 py-2 font-bold text-foreground bg-background">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item)}
                              className="px-4 py-2 hover:bg-brand-primary hover:text-white transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Subtotal:</span>
                          <span className="text-2xl font-bold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Order Summary Card */}
              <div className="bg-background rounded-2xl border border-border shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Tag className="mr-2 w-6 h-6" />
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-foreground">
                      <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">${subtotal > 50 ? '0.00' : '50.00'}</span>
                    </div>
                    {subtotal > 50 && (
                      <div className="flex items-center gap-2 text-success text-sm">
                        <Truck className="w-4 h-4" />
                        <span>Free shipping applied!</span>
                      </div>
                    )}
                    <div className="flex justify-between text-foreground">
                      <span className="text-muted-foreground">Tax (Estimated)</span>
                      <span className="font-semibold">${(subtotal * 0.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t border-border my-4"></div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-foreground">Total</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-brand-primary">
                        ${(subtotal + (subtotal > 50 ? 0 : 50) + subtotal * 0.1).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">Including taxes</p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => handleValidate()}
                    className="group w-full mt-6 px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => navigate("/")}
                    className="w-full px-6 py-3 border-2 border-border text-foreground hover:border-brand-primary hover:text-brand-primary rounded-xl font-semibold transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* Promo Code Card */}
              <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl border border-warning/20 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-warning" />
                  </div>
                  <h3 className="font-semibold text-foreground">Have a promo code?</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button className="px-6 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-secondary transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-success flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Secure Checkout</p>
                  <p className="text-xs text-muted-foreground">Your payment information is protected</p>
                </div>
              </div>
            </div>
          </div>
      </div>

        <LoginAlertModal
          isOpen={showLoginAlert}
          onClose={() => setShowLoginAlert(false)}
        />
      </div>
    </div>
  );
};

export default CartPage;
