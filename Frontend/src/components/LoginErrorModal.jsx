import React from "react";
import { Button } from "../components/ui/button";

const LoginErrorModal = ({ errorMessage, onClose }) => {
  if (!errorMessage) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col  items-center gap-4 bg-background p-8 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-red-600">Login Failed</h2>
        <p className="text-center text-sm text-muted-foreground">{errorMessage}</p>
        <Button onClick={onClose} className="w-full mt-2">Close</Button>
      </div>
    </div>
  );
};

export default LoginErrorModal;
