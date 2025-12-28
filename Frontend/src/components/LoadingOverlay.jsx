import React from "react";
import { Loader2 } from "lucide-react";

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 bg-card p-8 rounded-lg shadow-lg">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-lg font-semibold text-foreground">Logging in...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
