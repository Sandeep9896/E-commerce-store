import React, { use, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Camera, Edit3, User, Mail, MapPin, Phone, Package, Clock, CheckCircle, TrendingUp, Save, X, ShoppingBag, CreditCard, MapPinned, Calendar } from "lucide-react";
import useUploadAvatar from "../hooks/useUploadAvatar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, login } from "../slices/authSlice";
import { useLocalStorage } from "../hooks/useLocalStorage";
import api from "../api/api";
import LoginAlertModal from "../components/LoginAlertModal";
import { ExternalLink } from "lucide-react";


const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isLoggedInLocalStorage] = useLocalStorage("isLoggedIn");
  const [loginAlert, setLoginAlert] = useState(false);

  const { uploadAvatar: handleImageChange } = useUploadAvatar();
  const [storedUser, setStoredUser] = useLocalStorage("user");

  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    isLoggedIn && (async () => {
      try {
        const { data } = await api.post('/users/fetch-orders', {
          allOrders: true
        });
        console.log("Fetched orders:", data);
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    })();
  }, [isLoggedIn]);

  // Consolidated auth and profile loading logic
  useEffect(() => {
    let isMounted = true;

    const initializeProfile = async () => {
      try {
        // Step 1: Restore from localStorage if not logged in
        if (!isLoggedIn && isLoggedInLocalStorage && storedUser) {
          dispatch(login(storedUser));
          setForm(storedUser);
          setLoading(false);
          return;
        }

        // Step 2: Not logged in and no stored data - show login alert
        if (!isLoggedIn && !isLoggedInLocalStorage) {
          setLoading(false);
          setLoginAlert(true);
          return;
        }

        // Step 3: Logged in - fetch fresh profile data
        if (isLoggedIn) {
          setLoading(true);
          const { data } = await api.get('/users/profile');
          console.log("Fetched profile data:", data);

          if (isMounted && data?.user) {
            dispatch(setUser(data.user));
            setStoredUser(data.user);
            setForm(data.user);
          }

        }
        else {
          console.log("No user data in profile response");
          setLoginAlert(true);
        }
      } catch (err) {
        console.error("Profile initialization error:", err);

        // Fallback to stored user on API error
        if (isMounted && storedUser) {
          dispatch(setUser(storedUser));
          setForm(storedUser);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeProfile();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, isLoggedInLocalStorage, dispatch]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "street" || name === "city" || name === "state" || name === "pincode") {
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

  // Save updated profile data
  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await api.put('/users/update-profile', form);
      console.log("Profile update response:", data);

      const updatedUser = data?.user || form;

      // Update all state stores
      dispatch(setUser(updatedUser));
      setStoredUser(updatedUser);
      setForm(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Loading Profile</h3>
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
            <X className="w-10 h-10 text-error" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Oops! Something went wrong</h3>
          <p className="text-error mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get avatar URL safely
  const avatarUrl = user?.avatar?.url || user?.avatar || "/images/user.svg";
  console.log("Avatar URL:", avatarUrl);
  
  // Calculate stats
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.orderStatus === "Delivered").length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  return (
    <div className="bg-gradient-to-b from-background to-muted/20 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="profileImage"
                className="absolute bottom-2 right-2 bg-white p-3 rounded-full text-brand-primary cursor-pointer hover:bg-brand-light transition-all duration-300 shadow-lg hover:scale-110"
              >
                <Camera size={20} />
                <input
                  id="profileImage"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "users/upload-avatar")}
                />
              </label>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {form.name || "User"}
              </h1>
              <p className="text-white/90 text-lg mb-1">{form.email}</p>
              <p className="text-white/80 text-sm flex items-center justify-center sm:justify-start gap-2">
                <Calendar className="w-4 h-4" />
                Member since {form.createdAt ? new Date(form.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "2024"}
              </p>
            </div>
            
            {/* Edit Button */}
            <button
              onClick={() => {
                if (isEditing) {
                  setForm(user || storedUser || {});
                  setError(null);
                }
                setIsEditing(!isEditing);
              }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <X className="w-5 h-5" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-5 h-5" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 -mt-16">
          <div className="bg-background rounded-2xl border border-border shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-info/10 flex items-center justify-center">
                <Package className="w-7 h-7 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-background rounded-2xl border border-border shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-3xl font-bold text-foreground">{deliveredOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-background rounded-2xl border border-border shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-3xl font-bold text-foreground">${totalSpent.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-background rounded-2xl border border-border shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 px-6 py-4 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <User className="w-6 h-6" />
              Personal Information
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Name */}
            <div className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="text-brand-primary w-5 h-5" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Full Name</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="name"
                      value={form.name || ""}
                      onChange={handleChange}
                      className="bg-background border-border focus:border-brand-primary"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-foreground text-lg font-semibold">{form.name || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-info w-5 h-5" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Email Address</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      name="email"
                      value={form.email || ""}
                      onChange={handleChange}
                      className="bg-background border-border opacity-60 cursor-not-allowed"
                      disabled={true}
                    />
                  ) : (
                    <p className="text-foreground text-lg font-semibold">{form.email || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-success w-5 h-5" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Phone Number</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="phone"
                      value={form.phone || ""}
                      onChange={handleChange}
                      className="bg-background border-border focus:border-brand-primary"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-foreground text-lg font-semibold">{form.phone || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <MapPinned className="text-warning w-5 h-5" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground block mb-2">Delivery Address</label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Street Address</label>
                        <Input
                          type="text"
                          name="street"
                          value={form.address?.street || ""}
                          onChange={handleChange}
                          className="bg-background border-border focus:border-brand-primary"
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">City</label>
                          <Input
                            type="text"
                            name="city"
                            value={form.address?.city || ""}
                            onChange={handleChange}
                            className="bg-background border-border focus:border-brand-primary"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">State</label>
                          <Input
                            type="text"
                            name="state"
                            value={form.address?.state || ""}
                            onChange={handleChange}
                            className="bg-background border-border focus:border-brand-primary"
                            placeholder="State"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Pincode</label>
                        <Input
                          type="text"
                          name="pincode"
                          value={form.address?.pincode || ""}
                          onChange={handleChange}
                          className="bg-background border-border focus:border-brand-primary"
                          placeholder="123456"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground text-lg font-semibold leading-relaxed">
                      {form.address?.street && form.address?.city 
                        ? `${form.address.street}, ${form.address.city}, ${form.address.state} - ${form.address.pincode}`
                        : "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-background rounded-2xl border border-border shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Recent Orders
            </h2>
            <button
              onClick={() => navigate("/user/recent-orders")}
              className="flex items-center gap-2 px-4 py-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all duration-300 font-semibold"
            >
              View All
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Package className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">No orders yet</p>
                <p className="text-sm text-muted-foreground mb-4">Start shopping to see your orders here</p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order._id}
                    className="group bg-muted/30 rounded-xl p-5 border border-border hover:border-brand-primary/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                          <Package className="w-6 h-6 text-brand-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <span
                        className={`px-4 py-2 rounded-full font-semibold text-sm inline-flex items-center gap-2 w-fit
                          ${order.orderStatus === "Delivered"
                            ? "bg-success/10 text-success"
                            : order.orderStatus === "Shipped"
                              ? "bg-info/10 text-info"
                              : "bg-warning/10 text-warning"
                          }
                        `}
                      >
                        {order.orderStatus === "Delivered" && <CheckCircle className="w-4 h-4" />}
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        <span>Razorpay</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold text-brand-primary">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <LoginAlertModal
        isOpen={loginAlert}
        onClose={() => { setLoginAlert(false); navigate("/"); }}
      />
    </div>
  );
};

export default ProfilePage;
