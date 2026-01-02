import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../slices/authSlice";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { OrderSuccessfulModal } from "./OrderSuccesFulModal";
import handleRazorpayPayment from "./handleRazorpayPayment";
import { clearCart, setCartItems } from "../slices/cartSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Package, Truck, CheckCircle2, ChevronRight, Lock, Shield } from "lucide-react";

const HandleCheckOut = ({
  onChangeAddress,
}) => {
  const dispatch = useDispatch();
  const [address, setAddress] = React.useState(useSelector((state) => state.auth.user?.address));
  const cartItems = useSelector((state) => state.cart.cartItems);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [storedUser, setStoredUser] = useLocalStorage("user");
  const [form, setForm] = React.useState(storedUser || {});
  const [onChangeAddressState, setOnChangeAddressState] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const product = location.state?.product || null;

  const addressData = address || form.address || {};

  // Rehydrate cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      if (isLoggedIn) {
        try {
          const response = await api.get("/users/cart");
          const cart = response.data?.cart || [];

          const normalizedItems = cart.map(item => ({
            _id: item.product._id,
            productName: item.product.productName,
            price: item.product.price,
            image: item.product.images?.[0]?.url,
            quantity: item.quantity
          }));

          dispatch(setCartItems(normalizedItems));
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      } else {
        // For guest users, load from localStorage
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        if (localCart.length > 0) {
          dispatch(setCartItems(localCart));
        }
      }
    };

    fetchCart();
  }, [isLoggedIn, dispatch]);

  useEffect(  () => {
    console.log("Stored user address changed:", totalAmount);
    setAddress(storedUser?.address);
    setAddress(storedUser?.address || {});
  },[storedUser])

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "pincode"].includes(name)) {
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddress = async () => {
    // Check if data actually changed
    const hasChanged = 
      form.name !== storedUser?.name ||
      form.phone !== storedUser?.phone ||
      form.address?.street !== storedUser?.address?.street ||
      form.address?.city !== storedUser?.address?.city ||
      form.address?.state !== storedUser?.address?.state ||
      form.address?.pincode !== storedUser?.address?.pincode;

    if (!hasChanged) {
      console.log("No changes detected, skipping API call");
      setOnChangeAddressState(false);
      return;
    }

    console.log("Profile updated:", form);
    try {
      const { data } = await api.put('/users/update-profile', form);
      console.log("Profile update response:", data);

      const updatedUser = data?.user || form;
      dispatch(setUser(updatedUser));
      setStoredUser(updatedUser);
      setOnChangeAddressState(false);
      onChangeAddress && onChangeAddress(form.address);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
   const handlePaymentSuccess = (orderId) => {
    setOrderSuccess(true);
    setOrderId(orderId);

    api.post('/users/addOrder',{
      product: product 
    });
    // You can also clear the cart here if needed
    dispatch(clearCart());
    localStorage.removeItem("cart");
    
  }

  const handleProceed = () => {
    if(product){
    handleRazorpayPayment(product.price , handlePaymentSuccess, user);
    return;
    }
    handleRazorpayPayment(totalAmount + 50, handlePaymentSuccess, user);
    console.log("Proceeding to payment...");
  };

  return (
    <>
      {/* Order Success Modal */}
      <OrderSuccessfulModal
        isOpen={orderSuccess}
        onClose={() => {
          setOrderSuccess(false);
          navigate("/");
        }}
        orderId={orderId}
      />

      <div className="min-h-screen bg-gradient-to-b from-background via-background to-brand-primary/5">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary/80 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-8 h-8" />
              <h1 className="text-3xl sm:text-4xl font-bold">Checkout</h1>
            </div>
            <p className="text-white/80 text-sm sm:text-base">Complete your order securely</p>
          </div>
        </div>

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {(!addressData.street || onChangeAddressState) ? (
          // Address Form - Full Width on Mobile, Max Width on Desktop
          <div className="w-full lg:max-w-3xl mx-auto animate-fadeInUp">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-semibold text-sm">1</div>
                <span className="text-foreground font-medium text-sm sm:text-base">Shipping Info</span>
              </div>
              <div className="flex-1 h-1 bg-brand-primary/20 mx-2"></div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-8 h-8 rounded-full border-2 border-brand-primary/20 flex items-center justify-center font-semibold text-sm text-muted-foreground">2</div>
                <span className="text-muted-foreground font-medium text-sm sm:text-base">Payment</span>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-background border border-brand-primary/10 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
              <div className="flex flex-col gap-8">
                {/* Personal Information Section */}
                <div className="animate-slideIn" style={{ animationDelay: "100ms" }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Personal Information</h3>
                      <p className="text-sm text-muted-foreground">Enter your contact details</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-foreground font-semibold text-sm block mb-2.5">Full Name *</label>
                      <Input
                        type="text"
                        name="name"
                        value={form.name || ""}
                        onChange={handleChange}
                        className="w-full text-foreground placeholder:text-muted-foreground/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 h-11"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="text-foreground font-semibold text-sm block mb-2.5">Email Address</label>
                      <Input
                        type="email"
                        name="email"
                        value={form.email || ""}
                        disabled
                        className="w-full text-foreground/50 bg-brand-primary/5 border-brand-primary/10 h-11"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email address cannot be changed</p>
                    </div>

                    <div>
                      <label className="text-foreground font-semibold text-sm block mb-2.5">Phone Number *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">+91</span>
                        <Input
                          type="tel"
                          name="phone"
                          value={form.phone || ""}
                          onChange={handleChange}
                          className="w-full text-foreground placeholder:text-muted-foreground/50 pl-12 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 h-11"
                          placeholder="98765 43210"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-brand-primary/10"></div>

                {/* Address Section */}
                <div className="animate-slideIn" style={{ animationDelay: "200ms" }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-brand-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Delivery Address</h3>
                      <p className="text-sm text-muted-foreground">Where should we deliver?</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-foreground font-semibold text-sm block mb-2.5">Street Address *</label>
                      <Input
                        type="text"
                        name="street"
                        value={form.address?.street || ""}
                        onChange={handleChange}
                        className="w-full text-foreground placeholder:text-muted-foreground/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 h-11"
                        placeholder="House no., Building name"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-foreground font-semibold text-sm block mb-2.5">City *</label>
                        <Input
                          type="text"
                          name="city"
                          value={form.address?.city || ""}
                          onChange={handleChange}
                          className="w-full text-foreground placeholder:text-muted-foreground/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 h-11"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div>
                        <label className="text-foreground font-semibold text-sm block mb-2.5">State *</label>
                        <Input
                          type="text"
                          name="state"
                          value={form.address?.state || ""}
                          onChange={handleChange}
                          className="w-full text-foreground placeholder:text-muted-foreground/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 h-11"
                          placeholder="Maharashtra"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-foreground font-semibold text-sm block mb-2.5">Pincode *</label>
                      <Input
                        type="text"
                        name="pincode"
                        value={form.address?.pincode || ""}
                        onChange={handleChange}
                        className="w-full text-foreground placeholder:text-muted-foreground/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 h-11"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Note */}
                <div className="bg-brand-secondary/5 border border-brand-secondary/20 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-brand-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">Your information is encrypted and secure. We'll never share your data.</p>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleAddress}
                  className="w-full mt-4 bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/30 text-white font-semibold h-12 text-base group transition-all duration-300"
                >
                  Save & Continue to Payment
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Order Summary - Modern Two Column Layout
          <div className="animate-fadeInUp">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-foreground font-medium text-sm sm:text-base">Shipping Info</span>
              </div>
              <div className="flex-1 h-1 bg-brand-primary/20 mx-2"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-semibold text-sm">2</div>
                <span className="text-foreground font-medium text-sm sm:text-base">Payment</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Order Details */}
              <div className="lg:col-span-2 space-y-4 animate-slideIn">
                {/* User Info Card */}
                <div className="bg-background border border-brand-primary/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Shipping To</h3>
                  </div>
                  <div className="space-y-2 ml-13">
                    <p className="text-base font-semibold text-foreground">{form.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>✉️</span> {form.email}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>📱</span> {form.phone}
                    </p>
                  </div>
                </div>

                {/* Address Card */}
                <div className="bg-background border border-brand-secondary/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-brand-secondary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Delivery Address</h3>
                  </div>
                  <div className="space-y-2 ml-13 bg-brand-secondary/5 p-4 rounded-lg border border-brand-secondary/10">
                    <p className="text-sm font-medium text-foreground">
                      {addressData.street}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {addressData.city}, {addressData.state} - {addressData.pincode}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setOnChangeAddressState(true)}
                    className="w-full mt-4 border-brand-primary/20 hover:bg-brand-primary/5 hover:border-brand-primary/40"
                  >
                    Change Address
                  </Button>
                </div>
              </div>

              {/* Right Column - Order Summary Sidebar */}
              <div className="lg:col-span-1 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <div className="bg-gradient-to-b from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/10 rounded-xl shadow-xl sticky top-6 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border-b border-brand-primary/10 p-4 sm:p-6">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-brand-primary" />
                      <h3 className="text-lg font-bold text-foreground">Order Summary</h3>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                      {product ? (
                        <div className="flex gap-3 pb-4 border-b border-brand-primary/10 group">
                          {product.images && product.images[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.productName}
                              className="w-16 h-16 object-cover rounded-lg border border-brand-primary/10 group-hover:border-brand-primary/30 transition-all"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate group-hover:text-brand-primary transition-colors">
                              {product.productName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Quantity: 1</p>
                            <p className="font-bold text-brand-primary text-sm mt-2">
                              ${(product.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ) : cartItems && cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                          <div key={item._id} className="flex gap-3 pb-4 border-b border-brand-primary/10 last:border-b-0 group animate-slideIn" style={{ animationDelay: `${index * 50}ms` }}>
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-16 h-16 object-cover rounded-lg border border-brand-primary/10 group-hover:border-brand-primary/30 transition-all"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm truncate group-hover:text-brand-primary transition-colors">
                                {item.productName}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                              <p className="font-bold text-brand-primary text-sm mt-2">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm text-center py-8">No items in cart</p>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    {(cartItems && cartItems.length > 0) || product ? (
                      <div className="bg-background rounded-lg p-4 border border-brand-primary/10 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground text-sm font-medium">Subtotal:</span>
                          <span className="text-foreground font-semibold">${product ? product.price.toFixed(2) : totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-foreground text-sm font-medium">Shipping:</span>
                          <span className="text-success font-semibold flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            Free
                          </span>
                        </div>
                        <div className="border-t border-brand-primary/10 pt-3 flex justify-between items-center">
                          <p className="font-bold text-foreground">Total:</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                            ${product ? product.price.toFixed(2) : totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {/* Security Badge */}
                    <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-lg p-3 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-brand-primary flex-shrink-0" />
                      <p className="text-xs text-foreground/70 font-medium">Secure checkout powered by Razorpay</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="border-t border-brand-primary/10 p-4 sm:p-6 bg-gradient-to-t from-brand-primary/5 to-transparent">
                    <Button
                      onClick={handleProceed}
                      className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/30 text-white font-bold h-12 text-base group transition-all duration-300"
                    >
                      Proceed to Payment
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Click to securely complete your purchase
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default HandleCheckOut;
