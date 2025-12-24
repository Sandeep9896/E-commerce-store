import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


export function OrderSuccessfulModal({ isOpen, onClose, orderId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleContinue = () => {
    onClose();
    navigate("/");
    // api.delete("/users/cart"); // Clear cart on backend as well


  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] text-center">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 size={60} className="text-green-500" />
          </div>
          <DialogTitle className="text-2xl">
            Order Placed Successfully!
          </DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground mt-2">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {orderId && (
          <p className="mt-2 text-sm text-foreground">
            Order ID: <span className="font-semibold">{orderId}</span>
          </p>
        )}

        <DialogFooter className="mt-6">
          <Button className="w-full" onClick={handleContinue}>
            Continue Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
