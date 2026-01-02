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
import { Mail, Lock, User, LogIn, UserPlus, ShoppingBag, Shield, Store, ChevronRight } from "lucide-react";


// Custom hook: valid place to use hooks

const UserLogin = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(location.state?.data || "Login");
  const [storedUser, setStoredUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("accessToken", null);
  const [isLoggedInLocalStorage, setIsLoggedInLocalStorage] = useLocalStorage("isLoggedIn", false);
  const { handleLogin: originalHandleLogin, loading, error: loginError, setError: setLoginError } = useLogin("user");
  let [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);
  
  // Wrap handleLogin to close modal on success
  const handleLogin = async (e) => {
    const success = await originalHandleLogin(e);
    if (success && onClose) {
      onClose();
    }
  };
  
  const userSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError(null); // Clear previous errors
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
      if(data){
      console.log("Signup successful:", data);
      dispatch(login(data));
      setStoredUser(data.user);
      setToken(data.accessToken);
      setIsLoggedInLocalStorage(true);
      setSignupLoading(false);
      if (onClose) onClose(); // Close modal on success
      navigate("/user/profile");
      }
      // Optionally, you can auto-login the user after signup
      // onSubmit(e,formData); // Call login after successful signup
    } catch (error) {
      console.error("Signup failed:", error);
      setSignupError(error.response?.data?.message || "Signup failed. Please try again.");
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-primary/5 to-brand-secondary/5 flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/30 animate-float">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">Sign in to continue your shopping experience</p>
        </div>

        <Tabs
          defaultValue={data}
          className="w-full rounded-2xl bg-background/80 backdrop-blur-sm border border-brand-primary/10 shadow-xl overflow-hidden animate-slideIn"
        >
          {/* Tabs Header */}
          <TabsList className="grid grid-cols-2 w-full bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 p-1 rounded-none h-14">
            <TabsTrigger
              value="Login"
              className="font-semibold text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-primary data-[state=active]:to-brand-secondary data-[state=active]:text-white rounded-lg transition-all duration-300 h-12"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger
              value="Signup"
              className="font-semibold text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-primary data-[state=active]:to-brand-secondary data-[state=active]:text-white rounded-lg transition-all duration-300 h-12"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="Login" className="p-8">
            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-primary" />
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="h-11 pl-4 pr-4 border-brand-primary/20 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-primary" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    className="h-11 pl-4 pr-4 border-brand-primary/20 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-brand-primary hover:text-brand-secondary transition-colors">
                    Forgot Password?
                  </button>
                </div>
              </div>

              <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground text-center">
                  By continuing, you agree to our{" "}
                  <span className="text-brand-primary font-medium cursor-pointer hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-brand-primary font-medium cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </p>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/30 text-white font-semibold text-base group transition-all duration-300"
              >
                Sign In
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="Signup" className="p-8">
            <form className="space-y-5" onSubmit={userSignup}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-primary" />
                  Full Name
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  className="h-11 border-brand-primary/20 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-primary" />
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="h-11 border-brand-primary/20 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-primary" />
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  required
                  className="h-11 border-brand-primary/20 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="bg-brand-secondary/5 border border-brand-secondary/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground text-center">
                  By creating an account, you agree to our{" "}
                  <span className="text-brand-primary font-medium cursor-pointer hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-brand-primary font-medium cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </p>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg hover:shadow-band-secondary/30 text-white font-semibold text-base group transition-all duration-300"
              >
                Create Account
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-6 text-center animate-fadeInUp" style={{ animationDelay: "200ms" }}>
          <p className="text-sm text-muted-foreground">
            Need help? <span className="text-brand-primary font-medium cursor-pointer hover:underline">Contact Support</span>
          </p>
        </div>
      </div>
      
      <LoadingOverlay isLoading={loading||signupLoading} />
      {(loginError || signupError) && (
        <LoginErrorModal 
          errorMessage={loginError || signupError} 
          onClose={() => { 
            setLoginError(""); 
            setSignupError(""); 
          }} 
        />
      )}
    </div>
  );
};




const AdminLogin = () => {
  const { handleLogin, loading, error: loginError, setError: setLoginError } = useLogin("admin");
  const [signupError, setSignupError] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-error/5 to-warning/5 flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-error/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-warning/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-error to-warning flex items-center justify-center shadow-lg shadow-error/30 animate-float">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-error to-warning bg-clip-text text-transparent mb-2">
            Admin Portal
          </h1>
          <p className="text-muted-foreground">Secure access to administrative dashboard</p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl bg-background/80 backdrop-blur-sm border border-error/10 shadow-xl p-8 animate-slideIn">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-error" />
                Admin ID
              </label>
              <Input 
                type="text" 
                name="adminId" 
                placeholder="Enter your admin ID" 
                required 
                className="h-11 border-error/20 focus:border-error focus:ring-2 focus:ring-error/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-error" />
                Password
              </label>
              <Input 
                type="password" 
                name="password" 
                placeholder="Enter your password" 
                required 
                className="h-11 border-error/20 focus:border-error focus:ring-2 focus:ring-error/20 transition-all duration-200"
              />
            </div>

            <div className="bg-error/5 border border-error/10 rounded-lg p-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-error flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                This is a secure admin area. Unauthorized access is prohibited.
              </p>
            </div>

            <Button className="w-full h-12 bg-gradient-to-r from-error to-warning hover:shadow-lg hover:shadow-error/30 text-white font-semibold text-base group transition-all duration-300">
              Access Dashboard
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center animate-fadeInUp" style={{ animationDelay: "200ms" }}>
          <p className="text-sm text-muted-foreground">
            Having issues? <span className="text-error font-medium cursor-pointer hover:underline">Contact IT Support</span>
          </p>
        </div>
      </div>
      
      <LoadingOverlay isLoading={loading} />
      {(loginError || signupError) && (
        <LoginErrorModal 
          errorMessage={loginError || signupError} 
          onClose={() => { 
            setLoginError(""); 
            setSignupError(""); 
          }} 
        />
      )}
    </div>
  );
};

const SellerLogin = () => {
  const { handleLogin, loading, error: loginError, setError: setLoginError } = useLogin("seller");
  const [signupError, setSignupError] = useState(null);
  const [signupLoading, setSignupLoading] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-success/5 to-info/5 flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-success/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-info/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success to-info flex items-center justify-center shadow-lg shadow-success/30 animate-float">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-success to-info bg-clip-text text-transparent mb-2">
            Seller Portal
          </h1>
          <p className="text-muted-foreground">Manage your store and products</p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl bg-background/80 backdrop-blur-sm border border-success/10 shadow-xl p-8 animate-slideIn">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Store className="w-4 h-4 text-success" />
                Seller ID
              </label>
              <Input 
                type="text" 
                name="sellerId" 
                placeholder="Enter your seller ID" 
                required 
                className="h-11 border-success/20 focus:border-success focus:ring-2 focus:ring-success/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-success" />
                Password
              </label>
              <Input 
                type="password" 
                name="password" 
                placeholder="Enter your password" 
                required 
                className="h-11 border-success/20 focus:border-success focus:ring-2 focus:ring-success/20 transition-all duration-200"
              />
              <div className="flex justify-end">
                <button type="button" className="text-xs text-success hover:text-info transition-colors">
                  Forgot Password?
                </button>
              </div>
            </div>

            <div className="bg-success/5 border border-success/10 rounded-lg p-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-success flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Access your seller dashboard to manage inventory and orders.
              </p>
            </div>

            <Button className="w-full h-12 bg-gradient-to-r from-success to-info hover:shadow-lg hover:shadow-success/30 text-white font-semibold text-base group transition-all duration-300">
              Access Seller Dashboard
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center animate-fadeInUp" style={{ animationDelay: "200ms" }}>
          <p className="text-sm text-muted-foreground">
            New seller? <span className="text-success font-medium cursor-pointer hover:underline">Register Your Store</span>
          </p>
        </div>
      </div>
      
      <LoadingOverlay isLoading={loading||signupLoading} />
      {(loginError || signupError) && (
        <LoginErrorModal 
          errorMessage={loginError || signupError} 
          onClose={() => { 
            setLoginError(""); 
            setSignupError(""); 
          }} 
        />
      )}
    </div>
  );
};

export { UserLogin, AdminLogin, SellerLogin };