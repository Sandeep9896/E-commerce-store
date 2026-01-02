import { CheckCircle2, Package, Truck, Mail, ChevronRight } from "lucide-react";
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
  };

  const handleViewOrders = () => {
    onClose();
    navigate("/user/recent-orders");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden p-0">
        {/* Success Animation Header */}
        <div className="bg-gradient-to-br from-success/10 via-brand-primary/5 to-brand-secondary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full -translate-y-16 translate-x-16 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-primary/10 rounded-full translate-y-12 -translate-x-12 animate-float" style={{ animationDelay: "1s" }}></div>
          
          <DialogHeader className="relative z-10 pt-8 pb-6 px-6">
            <div className="flex justify-center mb-4 animate-scaleIn">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg shadow-success/30">
                  <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 w-20 h-20 rounded-full bg-success/30 animate-ping"></div>
              </div>
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground animate-fadeInUp">
              Order Placed Successfully! 🎉
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Order Details */}
        <div className="px-6 py-6 space-y-6">
          <p className="text-muted-foreground text-center animate-fadeInUp" style={{ animationDelay: "100ms" }}>
            Thank you for your purchase! Your order has been confirmed and is being processed.
          </p>

          {orderId && (
            <div className="bg-gradient-to-r from-brand-primary/5 via-brand-secondary/5 to-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-bold text-foreground tracking-wide">{orderId}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="space-y-3 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <p className="text-sm font-semibold text-foreground">What's Next?</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-brand-secondary/5 rounded-lg border border-brand-secondary/10">
                <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-brand-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Order Confirmation</p>
                  <p className="text-xs text-muted-foreground mt-0.5">We've sent a confirmation email with your order details.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-brand-primary/5 rounded-lg border border-brand-primary/10">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Delivery Updates</p>
                  <p className="text-xs text-muted-foreground mt-0.5">You'll receive updates as your order is shipped and delivered.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="flex-col sm:flex-row gap-3 px-6 pb-6 pt-2 bg-gradient-to-t from-brand-primary/5 to-transparent border-t border-brand-primary/10">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-brand-primary/20 hover:bg-brand-primary/5" 
            onClick={handleViewOrders}
          >
            View Orders
          </Button>
          <Button 
            className="w-full sm:w-auto bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/30 group" 
            onClick={handleContinue}
          >
            Continue Shopping
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
