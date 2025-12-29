import React,{useEffect} from "react";
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
import { useState } from "react";

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

  // Page rendering (no modal/overlay)
   if (orderSuccess) {
    return <OrderSuccessfulModal
      isOpen={orderSuccess}
      onClose={() => {setOrderSuccess(false); navigate("/")}}
      orderId={orderId}
    />

  };
  return (
    <div className="min-h-screen bg-background py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          {(!addressData.street || onChangeAddressState) ? "Complete Your Information" : "Order Summary"}
        </h1>

        {(!addressData.street || onChangeAddressState) ? (
          // Address Form - Full Width on Mobile, Max Width on Desktop
          <div className="w-full lg:max-w-2xl mx-auto">
            <div className="bg-background border rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex flex-col gap-5">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-foreground font-medium text-sm block mb-2">Full Name</label>
                      <Input
                        type="text"
                        name="name"
                        value={form.name || ""}
                        onChange={handleChange}
                        className="w-full text-foreground"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="text-foreground font-medium text-sm block mb-2">Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={form.email || ""}
                        disabled
                        className="w-full text-foreground opacity-70"
                      />
                    </div>

                    <div>
                      <label className="text-foreground font-medium text-sm block mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={form.phone || ""}
                        onChange={handleChange}
                        className="w-full text-foreground"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Delivery Address</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-foreground font-medium text-sm block mb-2">Street Address</label>
                      <Input
                        type="text"
                        name="street"
                        value={form.address?.street || ""}
                        onChange={handleChange}
                        className="w-full text-foreground"
                        placeholder="House no., Building name"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-foreground font-medium text-sm block mb-2">City</label>
                        <Input
                          type="text"
                          name="city"
                          value={form.address?.city || ""}
                          onChange={handleChange}
                          className="w-full text-foreground"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="text-foreground font-medium text-sm block mb-2">State</label>
                        <Input
                          type="text"
                          name="state"
                          value={form.address?.state || ""}
                          onChange={handleChange}
                          className="w-full text-foreground"
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-foreground font-medium text-sm block mb-2">Pincode</label>
                      <Input
                        type="text"
                        name="pincode"
                        value={form.address?.pincode || ""}
                        onChange={handleChange}
                        className="w-full text-foreground"
                        placeholder="Postal code"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleAddress}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 h-11 text-base"
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Order Summary - Two Column Layout on Desktop, Single Column on Mobile
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* User Info */}
              <div className="border rounded-xl p-4 sm:p-6 bg-accent/10 shadow">
                <h3 className="text-lg font-semibold text-foreground mb-3">Shipping To</h3>
                <div className="space-y-2">
                  <p className="text-base font-medium text-foreground">{form.name}</p>
                  <p className="text-sm text-muted-foreground">{form.email}</p>
                  <p className="text-sm text-muted-foreground">{form.phone}</p>
                </div>
              </div>

              {/* Address Card */}
              <div className="border rounded-xl p-4 sm:p-6 bg-accent/20 shadow">
                <h3 className="text-lg font-semibold text-foreground mb-3">Delivery Address</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {addressData.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {addressData.city}, {addressData.state} - {addressData.pincode}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setOnChangeAddressState(true)}
                  className="w-full mt-4"
                >
                  Change Address
                </Button>
              </div>
            </div>

            {/* Right Column - Order Items & Summary */}
            <div className="lg:col-span-1">
              {/* Order Items */}
              <div className="border rounded-xl p-4 sm:p-6 bg-accent/10 shadow sticky top-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Order Items</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto mb-4 pr-2">
                  {product ? (
                    <div className="flex gap-3 pb-3 border-b">
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {product.productName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Qty: 1</p>
                        <p className="font-semibold text-primary text-sm mt-1">
                          ${(product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ) : cartItems && cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div key={item._id} className="flex gap-3 pb-3 border-b last:border-b-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                          <p className="font-semibold text-primary text-sm mt-1">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">No items in cart</p>
                  )}
                </div>

                {/* Order Total */}
                {(cartItems && cartItems.length > 0) || product ? (
                  <div className="border-t pt-4 bg-accent/20 -m-6 p-6 rounded-b-xl">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-foreground">Subtotal:</span>
                        <span className="text-foreground">${product ? product.price.toFixed(2) : totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground">Shipping:</span>
                        <span className="text-foreground">Free</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t pt-4">
                      <p className="font-semibold text-foreground text-lg">Total:</p>
                      <p className="text-2xl font-bold text-primary">
                        ${product ? product.price.toFixed(2) : totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : null}

                <Button 
                  onClick={handleProceed} 
                  className="w-full mt-4 bg-primary hover:bg-primary/90 h-11 text-base"
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleCheckOut;
