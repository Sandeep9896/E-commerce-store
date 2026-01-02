import React from 'react'
import { useState, useEffect } from "react";
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

const SellerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isLoggedInLocalStorage, setIsLoggedInLocalStorage] = useLocalStorage("isLoggedIn", false);

  const { uploadAvatar: handleImageChange } = useUploadAvatar();
  const [storedUser, setStoredUser] = useLocalStorage("user", null);
  
  useEffect(() => {
    if (!isLoggedIn && isLoggedInLocalStorage) {
      dispatch(login(storedUser));
    }
  }, [isLoggedInLocalStorage, storedUser, dispatch]);
  

  
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data when component mounts
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/seller/profile');

        if (data && data.user) {
          // Update both Redux and localStorage with fresh data
          console.log("Fetched user profile:", data.user);
          dispatch(setUser(data.user));
          setStoredUser(data.user);
          // Initialize form with user data
          setForm(data.user);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");

        // If API call fails but we have stored user, use that as fallback
        if (!user && storedUser) {
          dispatch(setUser(storedUser));
          setForm(storedUser);
        }
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserProfile();

    } else if (storedUser && isLoggedIn) {

      // If not logged in but we have stored user, use that
      console.log("Using stored user:", storedUser, isLoggedInLocalStorage);
      setTimeout(() => {
        dispatch(login(storedUser));
        setForm(storedUser);
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, dispatch]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Save updated profile data
  const handleSave = async () => {
    try {
      // API call to update profile
      const { data } = await api.put('/seller/update-profile', form);

      if (data && data.user) {
        // Update Redux and localStorage with updated data
        dispatch(setUser(data.user));
        setStoredUser(data.user);
        setForm(data.user);
      } else {
        // Fallback if API doesn't return user object
        dispatch(setUser(form));
        setStoredUser(form);
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      // Could add toast notification here
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center text-foreground mt-20">
        <p className="text-lg mb-4">You are not logged in.</p>
        <Button
          onClick={() => navigate("/login/seller")}
          className="bg-primary text-foreground hover:bg-secondary"
        >
          Go to Login
        </Button>
      </div>
    );
  }

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
        <p className="text-lg mb-4 text-error">Error: {error}</p>
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
  const avatarUrl = user?.avatar?.url || user?.avatar || "/images/default-avatar.png";
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
                onChange={(e) => handleImageChange(e, "seller/upload-seller-avatar")}
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
                  // Reset form when canceling edit
                  setForm(user || storedUser);
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
                className="flex-1"
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
                className="flex-1"
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
                className="flex-1"
              />
            ) : (
              <p className="text-foreground text-lg">{form.phone || "Not set"}</p>
            )}
          </div>

          {/* Address */}
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" />
            {isEditing ? (
              <Input
                type="text"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                className="flex-1"
              />
            ) : (
              <p className="text-foreground text-lg">{form.address || "Not set"}</p>
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

    </div>
  );
}

export default SellerProfile