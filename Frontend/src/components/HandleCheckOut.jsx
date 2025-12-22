import React from "react";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";

const HandleCheckOut = ({
  isOpen,
  onClose,
  address,
  onProceed,
  onChangeAddress
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg bg-background rounded-xl shadow-lg p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">
          Confirm Delivery Address
        </h2>

        {/* Address Card */}
        <div className="border rounded-lg p-4 bg-accent/40 mb-4">
          <p className="font-medium text-foreground">
            {address.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {address.street}, {address.city}
          </p>
          <p className="text-sm text-muted-foreground">
            {address.state} - {address.pincode}
          </p>
          <p className="text-sm text-muted-foreground">
            Phone: {address.phone}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onChangeAddress}
            className="w-full"
          >
            Change Address
          </Button>

          <Button
            onClick={onProceed}
            className="w-full"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HandleCheckOut;
