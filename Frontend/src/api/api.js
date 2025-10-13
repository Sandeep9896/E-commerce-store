// api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // allows sending cookies (for refresh token)
  headers: {
    "Content-Type": "application/json",
    'ngrok-skip-browser-warning': 'true'  // Add this line to bypass ngrok browser warning
  }
});

// Automatically attach access token to all requests
api.interceptors.request.use(
  (config) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("accessToken");
      
      // Development-only log (remove in production)
      if (import.meta.env.DEV) {
        console.log("Token present:", !!token);
      }
      
      // If token exists, clean it and attach to headers
      if (token) {
        // Remove any accidental quotes that might have been stored
        const cleanToken = token.replace(/^["'](.*)["']$/, '$1');
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
      
      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return config; // Still return config to avoid breaking the request
    }
  },
  (error) => {
    // Handle request setup errors (rare, but possible)
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Handle token expiration automatically
api.interceptors.response.use(
  (response) => response, // success → just return
  async (error) => {
    const originalRequest = error.config;

    // If 403 Forbidden and not retried yet
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Ask backend for a new token
        const res = await axios.post("http://localhost:5000/api/refresh", {}, { withCredentials: true });

        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        window.location.href = "/login"; // if refresh fails → logout
      }
    }

    return Promise.reject(error);
  }
);

export default api;
