import React, { use, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Camera, Edit3, User, Mail, MapPin, Phone } from "lucide-react";
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
          allOrders: false
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-foreground mt-20">
        <p className="text-lg mb-4 text-red-500">Error: {error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-primary text-foreground hover:bg-secondary"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Get avatar URL safely
  const avatarUrl = user?.avatar?.url || user?.avatar || "/images/user.svg";
  console.log("Avatar URL:", avatarUrl);
  return (

    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
        My Profile
      </h1>

      <Card className="p-6 shadow-lg rounded-xl bg-accent/60 border border-border">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">
          <div className="relative w-32 h-32">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md"
            />
            <label
              htmlFor="profileImage"
              className="absolute bottom-1 right-1 bg-primary p-2 rounded-full text-foreground cursor-pointer hover:bg-secondary transition"
            >
              <Camera size={18} />
              <input
                id="profileImage"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "users/upload-avatar")}
              />
            </label>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-foreground">
              {form.name || "User"}
            </h2>
            <p className="text-foreground/70">{form.email}</p>
            <p className="text-sm text-foreground/70 mt-1">
              Member since {form.createdAt
                ? new Date(form.createdAt).toLocaleDateString()
                : "2024"}
            </p>
          </div>

          <div className="ml-auto mt-3 sm:mt-0">
            <Button
              onClick={() => {
                if (isEditing) {
                  // Reset form to current user data when canceling
                  setForm(user || storedUser || {});
                  setError(null);
                }
                setIsEditing(!isEditing);
              }}
              className="bg-primary text-foreground hover:bg-secondary"
            >
              {isEditing ? "Cancel" : <Edit3 size={16} className="mr-2" />}
              {isEditing ? "" : "Edit Profile"}
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-5">
          {/* Name */}
          <div className="flex items-center gap-3">
            <User className="text-primary" />
            {isEditing ? (
              <Input
                type="text"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                className="flex-1 text-foreground"
              />
            ) : (
              <p className="text-foreground text-lg">{form.name || "Not set"}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="text-primary" />
            {isEditing ? (
              <Input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                className="flex-1 text-foreground"
                disabled={true} // Email should not be editable
              />
            ) : (
              <p className="text-foreground text-lg">{form.email || "Not set"}</p>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone className="text-primary" />
            {isEditing ? (
              <Input
                type="text"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className="flex-1 text-foreground"
              />
            ) : (
              <p className="text-foreground text-lg">{form.phone || "Not set"}</p>
            )}
          </div>

          {/* Address */}
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" />
            {isEditing ? (
              <div className="flex flex-col w-full gap-2">
                <label className="text-foreground font-medium">Street Address</label>
                <Input
                  type="text"
                  name="street"
                  value={form.address?.street || ""}
                  onChange={handleChange}
                  className="flex-1 text-foreground"
                />
                <label className="text-foreground font-medium"> City </label>
                <Input
                  type="text"
                  name="city"
                  value={form.address?.city || ""}
                  onChange={handleChange}
                  className="flex-1 text-foreground p-2"
                />
                <label className="text-foreground font-medium"> State </label>
                <Input
                  type="text"
                  name="state"
                  value={form.address?.state || ""}
                  onChange={handleChange}
                  className="flex-1 text-foreground p-2"
                />
                <label className="text-foreground font-medium"> Pincode </label>
                <Input
                  type="text"
                  name="pincode"
                  value={form.address?.pincode || ""}
                  onChange={handleChange}
                  className="flex-1 text-foreground p-2"
                />


              </div>

            ) : (
              <p className="text-foreground text-lg">{form.address?.street + ", " + form.address?.city + ", " + form.address?.state + " - " + form.address?.pincode || "Not set"}</p>
            )}
          </div>

          {isEditing && (
            <Button
              onClick={handleSave}
              className="mt-5 bg-primary text-foreground hover:bg-secondary w-full sm:w-auto"
            >
              Save Changes
            </Button>
          )}
        </div>
      </Card>

      {/* Order History Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Recent Orders <button className=" mt-5 hover:text-primary " onClick={()=> navigate("/user/recent-orders")} ><ExternalLink className="w-6 h-5" />
          </button>
        </h2>
        <div className="bg-accent/50 rounded-lg p-4 shadow-md text-sm sm:text-base">
          {/* <p className="text-foreground/70">You have no recent orders.</p> */}
          {orders.length === 0 && (
            <p className="text-foreground/70">You have no recent orders.</p>
          )}
          {orders.length > 0 && orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col gap-2 py-4 px-3 rounded-lg bg-accent/40 border border-border shadow-sm hover:shadow-md transition"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Order #{order._id.slice(-6)}
                </p>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium
        ${order.orderStatus === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.orderStatus === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
      `}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground">
                <p>
                  📅 {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  💳 Razorpay
                </p>
              </div>

              {/* Amount */}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <p className="text-sm text-foreground">
                  Total Amount
                </p>
                <p className="text-base font-semibold text-foreground">
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

          ))}
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
