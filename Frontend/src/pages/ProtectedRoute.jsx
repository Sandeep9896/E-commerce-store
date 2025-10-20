// ProtectedRoute.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { setUser } from "../slices/authSlice";
import UserLayout from "../layout/UserLayout";
import SellerLayout from "../layout/SellerLayout";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [storedUser] = useLocalStorage("user", null);
  console.log("Stored User:", storedUser, "isLoggedIn:", isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Restore user from localStorage
  useEffect(() => {
    if (storedUser && !isLoggedIn) {
      dispatch(setUser(storedUser));
    }
  }, [storedUser, isLoggedIn, dispatch]);

  // Redirect logic
  useEffect(() => {
    if (!isLoggedIn && !storedUser) {
      navigate(`/login/${allowedRole}`);
    } else if (user && allowedRole && user.role !== allowedRole) {
      // Wrong role trying to access this route
      navigate(`/login/${allowedRole}`);
    }
  }, [isLoggedIn, storedUser, user, navigate, allowedRole]);

  if (!isLoggedIn && storedUser) {
    return <p>Loading...</p>;
  }
    return <Outlet />;
  
};

export default ProtectedRoute;
