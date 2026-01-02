import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { ShieldAlert, LogIn, UserPlus, X, Lock } from "lucide-react";

const LoginAlertModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login/user", { state: { returnUrl: window.location.pathname, data:"Login" } });
  };

  const handleSignup = () => {
    onClose();
    navigate("/login/user", { state: { returnUrl: window.location.pathname, data:"Signup" } }); // Assuming signup is part of login page
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] overflow-hidden p-0">
        {/* Close Button - Explicit */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-white/80 hover:bg-white text-foreground hover:text-brand-primary transition-all duration-200 border border-brand-primary/10 hover:border-brand-primary/30 shadow-lg hover:shadow-brand-primary/20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full -translate-y-16 translate-x-16 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-primary/10 rounded-full translate-y-12 -translate-x-12 animate-float" style={{ animationDelay: "1s" }}></div>
        
        {/* Header */}
        <div className="bg-gradient-to-br from-warning/10 via-brand-primary/5 to-brand-secondary/5 relative overflow-hidden">
          <DialogHeader className="relative z-10 pt-8 pb-6 px-6">
            <div className="flex justify-center mb-4 animate-scaleIn">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg shadow-warning/30">
                  <ShieldAlert className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-warning/30 animate-ping"></div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-foreground animate-fadeInUp">
              Authentication Required
            </DialogTitle>
            <DialogDescription className="pt-3 text-center text-base text-muted-foreground animate-fadeInUp" style={{ animationDelay: "100ms" }}>
              You need to be logged in to access this feature. Please login to your account or create a new one to continue.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Benefits */}
          <div className="bg-gradient-to-r from-brand-primary/5 via-brand-secondary/5 to-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Secure Account Access</p>
                <p className="text-xs text-muted-foreground mt-1">Save your preferences, track orders, and enjoy personalized shopping.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/30 text-white h-11 group transition-all duration-300"
            >
              <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
              Login to Account
            </Button>
            <Button
              onClick={handleSignup}
              variant="outline"
              className="w-full border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/50 h-11 group transition-all duration-300"
            >
              <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Create New Account
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/50 h-11 group transition-all duration-300"
            >
              <X className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginAlertModal;
