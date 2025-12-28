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
import { AlertCircle } from "lucide-react";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <DialogTitle className="text-xl">Authentication Required</DialogTitle>
          </div>
          <DialogDescription className="pt-4 text-base">
            You need to be logged in to access this feature. Please login to your
            account or create a new one to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleLogin}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Login to Account
          </Button>
          <Button
            onClick={handleSignup}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10"
          >
            Create New Account
          </Button>
          <Button
            onClick={ onClose }
            variant="ghost"
            className="w-full text-muted-foreground"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginAlertModal;
