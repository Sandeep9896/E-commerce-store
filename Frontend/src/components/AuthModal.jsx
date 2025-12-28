import { Dialog, DialogContent } from "../components/ui/dialog";
import {UserLogin} from "../pages/Login";

const AuthModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md">
        <UserLogin onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
