import React from "react";
import { Button } from "../components/ui/button";
import { XCircle, AlertTriangle, X, RefreshCw } from "lucide-react";

const LoginErrorModal = ({ errorMessage, onClose }) => {
  if (!errorMessage) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scaleIn">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full -translate-y-16 translate-x-16 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-error/5 rounded-full translate-y-12 -translate-x-12 animate-float" style={{ animationDelay: "1s" }}></div>
        
        {/* Header */}
        <div className="bg-gradient-to-br from-error/10 via-error/5 to-background relative overflow-hidden">
          <div className="relative z-10 pt-8 pb-6 px-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-error to-error/80 flex items-center justify-center shadow-lg shadow-error/30">
                  <XCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-error/30 animate-ping"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-foreground">Login Failed</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Error Message */}
          <div className="bg-error/5 border border-error/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-error" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">Unable to Sign In</p>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-lg p-3">
            <p className="text-xs text-muted-foreground text-center">
              💡 Check your credentials and try again. If the problem persists, contact support.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={onClose} 
              className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/30 text-white h-11 group transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-muted-foreground/20 text-muted-foreground hover:bg-muted/50 h-11 group transition-all duration-300"
            >
              <X className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginErrorModal;
