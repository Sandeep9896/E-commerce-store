import { useCallback, useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../slices/authSlice";
import { useLocalStorage } from "./useLocalStorage";
import api from "../api/api"; // adjust the import path as necessary

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
 useEffect(() => {
        console.log(cartItems);
      }, [cartItems]);
  return useCallback(
    async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      

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
        navigate(returnUrl); // ensure your route is lowercase
      } catch (err) {
        console.error("Login failed:", err);
      }
    },
    [dispatch, navigate, role, returnUrl]
  );
}
export default useLogin;