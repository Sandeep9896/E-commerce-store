import { Dialog, DialogContent } from "../components/ui/dialog";
import {UserLogin} from "../pages/Login";
import { X } from "lucide-react";

const AuthModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-white/80 hover:bg-white text-foreground hover:text-brand-primary transition-all duration-200 border border-brand-primary/10 hover:border-brand-primary/30 shadow-lg hover:shadow-brand-primary/20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        <UserLogin onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
