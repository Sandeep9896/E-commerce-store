import { useCallback, useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../slices/authSlice";
import { useLocalStorage } from "./useLocalStorage";
import api from "../api/api"; // adjust the import path as necessary
import { set } from "lodash";

function useLogin(role) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [roleKey, setRoleKey] = useLocalStorage("role", role);
  const [storedUser, setStoredUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("accessToken", null);
  const [isLoggedInLocalStorage, setIsLoggedInLocalStorage] = useLocalStorage("isLoggedIn", false);
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || `/${role}/profile`;
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = useCallback(
    async (e, formData) => {
      e.preventDefault();
      setLoading(true);
      setError(null); // Clear previous errors
      const form = e.currentTarget;
      if (!formData) {
        var formData = new FormData(form);
      }
      else {
        console.log("Using provided formData", formData.get("email"), formData.get("password"));
      }

      // Support different field names per form
      const email =
        formData.get("email") ||
        formData.get("adminId") ||
        formData.get("sellerId");
      const password = formData.get("password");

      try {
        const { data } = await api.post("/auth/login", { role, email, password });
        dispatch(login(data));
        setStoredUser(data.user);
        setToken(data.accessToken);
        setIsLoggedInLocalStorage(true);
        
        // Save to localStorage based on role
        console.log("isLoggedIn:", isLoggedIn, role, data);
        setLoading(false);
        navigate(returnUrl); // ensure your route is lowercase
        return true; // Success
      } catch (err) {
        console.error("Login failed:", err);
        setError(err.response?.data?.message || "Login failed. Please try again.");
        setLoading(false);
        return false; // Failure
      }
    },
    [dispatch, navigate, role, returnUrl]
  );

  return { handleLogin, loading, error ,setError};
}
export default useLogin;