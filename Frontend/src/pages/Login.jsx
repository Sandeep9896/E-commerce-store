import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import api from "../api/api";
import useLogin from "../hooks/useLogin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useDispatch,useSelector } from "react-redux";
import { login } from "../slices/authSlice";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import { useState } from "react";
import LoginErrorModal from "../components/LoginErrorModal";


// Custom hook: valid place to use hooks

const UserLogin = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(location.state?.data || "Login");
  const [storedUser, setStoredUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("accessToken", null);
  const [isLoggedInLocalStorage, setIsLoggedInLocalStorage] = useLocalStorage("isLoggedIn", false);
  const { handleLogin, loading, error: loginError, setError: setLoginError } = useLogin("user");
  let [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const userSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    console.log("Signing up user:", formData);
    try {
      const response = await api.post("/auth/register/user", {
        name,
        email,
        password
      });
      const data = response.data;
      console.log("Signup successful:", data);
      dispatch(login(data));
      setStoredUser(data.user);
      setToken(data.accessToken);
      setIsLoggedInLocalStorage(true);
      setSignupLoading(false);
      navigate("/user/profile");
      // Optionally, you can auto-login the user after signup
      // onSubmit(e,formData); // Call login after successful signup
    } catch (error) {
      console.error("Signup failed:", error);
      setSignupError(error.response?.data?.message || "Signup failed. Please try again.");
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex items-start sm:items-center justify-center p-4  ">
      <Tabs
        defaultValue={data}
        className="w-full max-w-md rounded-2xl  bg-card p-6 shadow-lg"
      >
        {/* Tabs Header */}
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger
            value="Login"
            className="font-semibold text-base"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="Signup"
            className="font-semibold text-base"
          >
            Signup
          </TabsTrigger>
        </TabsList>

        {/* Login */}
        <TabsContent value="Login">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="you@gmail.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="********"
                required
              />
            </div>

            <p className="text-xs text-muted-foreground text-center pt-2">
              By continuing, you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-primary cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>

            <Button onClick={onClose}  className="w-full mt-2">
              Login
            </Button>
          </form>
        </TabsContent>

        {/* Signup */}
        <TabsContent value="Signup">
          <form className="space-y-4" onSubmit={userSignup}>
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                type="text"
                name="name"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="you@gmail.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="********"
                required
              />
            </div>

            <p className="text-xs text-muted-foreground text-center pt-2">
              By creating an account, you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-primary cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>

            <Button onClick={onClose} className="w-full mt-2">
              Create Account
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      <LoadingOverlay isLoading={loading||signupLoading} />
      <LoginErrorModal errorMessage={loginError||signupError} onClose={() => { setLoginError(""); setSignupError(""); }} />

    </div>
  );
};




const AdminLogin = () => {
  const { handleLogin, loading, error: loginError, setError: setLoginError } = useLogin("admin");
  const [signupError, setSignupError] = useState(null);
  
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <Input type="text" name="adminId" placeholder="Admin ID" required />
        <Input type="password" name="password" placeholder="Password" required />
        <Button>Login</Button>
      </form>
      <LoadingOverlay isLoading={loading} />
    </div>
  );
};

const SellerLogin = () => {
  const { handleLogin, loading, error: loginError, setError: setLoginError } = useLogin("seller");
  const [signupError, setSignupError] = useState(null);
  const [signupLoading, setSignupLoading] = useState(false);
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Seller Login</h2>
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <Input type="text" name="sellerId" placeholder="Seller ID" required />
        <Input type="password" name="password" placeholder="Password" required />
        <Button>Login</Button>
      </form>
      <LoadingOverlay isLoading={loading||signupLoading} />
    </div>
  );
};

export { UserLogin, AdminLogin, SellerLogin };