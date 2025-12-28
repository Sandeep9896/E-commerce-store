import React from "react";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import api from "../api/api"; 
import { useDispatch } from "react-redux";
import { setUser } from "../slices/authSlice";
import { useLocalStorage } from "../hooks/useLocalStorage";
const HandleCheckOut = ({
  isOpen,
  onClose,
  address,
  phone,
  onProceed,
  onChangeAddress
}) => {
  const dispatch = useDispatch();
  const [storedUser, setStoredUser] = useLocalStorage("user");
    const [form, setForm] = React.useState(storedUser || {});
    const [onChangeAddressState, setOnChangeAddressState] = React.useState(false);

  console.log("Address in HandleCheckOut:", address);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "street" || name === "city" || name === "state" || name === "pincode") {
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleAddress = async () => {
    console.log("Address submitted:", form.address);
    // You can add validation here if needed
    const { data } = await api.put('/users/update-profile', form);
    console.log("Profile update response:", data);

    const updatedUser = data?.user || form;

    // Update all state stores
    dispatch(setUser(updatedUser));
    setStoredUser(updatedUser);
    setOnChangeAddressState(false);

    onChangeAddress(form.address);
  }
  if (!isOpen) return null;
  if (!address.street || onChangeAddressState) return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 w-[90%] border-2 rounded-2xl sm:max-w-md">
        <h1 className=" text-2xl p-4 text-center " >Add Address to continue</h1>
        <div className="flex flex-col w-full self-center p-10  gap-2">
          <label className="text-foreground font-medium">Street Address</label>
          <Input
            type="text"
            name="street"
            value={form.address?.street || ""}
            onChange={handleChange}
            className="flex-1  text-foreground"
          />
          <label className="text-foreground font-medium"> City </label>
          <Input
            type="text"
            name="city"
            value={form.address?.city || ""}
            onChange={handleChange}
            className="flex-1  text-foreground p-2"
          />
          <label className="text-foreground font-medium"> State </label>
          <Input
            type="text"
            name="state"
            value={form.address?.state || ""}
            onChange={handleChange}
            className="flex-1  text-foreground p-2"
          />
          <label className="text-foreground font-medium"> Pincode </label>
          <Input
            type="text"
            name="pincode"
            value={form.address?.pincode || ""}
            onChange={handleChange}
            className="flex-1  text-foreground p-2"
          />
          <button className=" text-foreground flex justify-center self-center bg-accent p-2 rounded-xl w-1/2" onClick={handleAddress} > Add Address </button>

        </div>
      </DialogContent>
    </Dialog>
  );

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
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setOnChangeAddressState(true)}
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
