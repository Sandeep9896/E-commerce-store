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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Log all API errors to help debug
    console.log("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: originalRequest?.url
    });

    // Check only for 401/403 status, don't check message content
    if ((error.response?.status === 401 || error.response?.status === 403) && 
        !originalRequest._retry) {
      
      console.log("Auth error detected, attempting token refresh...");
      originalRequest._retry = true;

      try {
        // Make sure the URL is correct - check your backend routes
        const refreshUrl = `${import.meta.env.VITE_API_URL}/auth/refresh-token`;
        console.log("Calling refresh endpoint:", refreshUrl);
        
        const res = await axios.post(refreshUrl, {}, { 
          withCredentials: true,
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });

        console.log("Refresh response:", res.data);

        // Check for accessToken or token property
        const newToken = res.data.accessToken || res.data.token;
        
        if (!newToken) {
          throw new Error("No token returned from refresh endpoint");
        }

        localStorage.setItem("accessToken", newToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent('authExpired'));
        
        // setTimeout(() => {
        //   localStorage.removeItem("accessToken");
        //   window.location.href = "/login/user";
        // }, 100);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
