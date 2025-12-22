import React, { useState } from "react";
import { Button } from "../components/ui/button"; // shadcn UI button (or your own)
import { Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import handleRazorpayPayment from "../components/handleRazorpayPayment";
import api from "../api/api";
import HandleCheckOut from "../components/HandleCheckOut";
import { setCartItems } from '../slices/cartSlice'
import LoginAlertModal from "../components/LoginAlertModal";

const CartPage = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const isloggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    // Example API call to fetch initial data
    const fetchData = async () => {
      try {
        const response = await api.get('/users/cart');
        const cart = response.data?.cart || [];

        const normalizedItems = cart.map((item) => ({
          _id: item?.product?._id,
          productName: item?.product?.productName,
          price: item?.product?.price,
          image: item?.product?.images?.[0]?.url,
          quantity: item?.quantity ?? 0
        }));

        dispatch(setCartItems(normalizedItems));
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
      finally {
        setLoading(false);
      }
      console.log("Fetched and set cart items")
    };

    fetchData();
  }, [dispatch]);


  const handleQuantityChange = async (item) => {
    dispatch(addToCart(item));
    try {
      await
        api.put('/users/updateCart', {
          productId: item._id,
          quantity: item.quantity + 1
        });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }

  };

  const handleRemove = async (item, deletedItem = false) => {
    dispatch(removeFromCart({ item, deletedItem }));

    if (deletedItem || item.quantity === 1) {
      try {
        await api.delete(`/users/cart/${item._id}`);
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
      return;
    }

    try {
      api.put('/users/updateCart', {
        productId: item._id,
        quantity: item.quantity - 1
      });

    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const [open, setOpen] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const address = {
    name: "Sandeep Sahani",
    street: "Sector 22",
    city: "Chandigarh",
    state: "Punjab",
    pincode: "160022",
    phone: "9876543210"
  };
  const handleValidate = () => {
    console.log("Validating checkout details...");
    if (isloggedIn) {
      setOpen(true);
    }
    else {
      setShowLoginAlert(true);
    }

  }

  const handleProceed = () => {
    setOpen(false);

    handleRazorpayPayment(subtotal + 50);
    console.log("Proceeding to payment...");
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-foreground text-lg">Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <img
          src="/images/empty-cart.png"
          alt="Empty Cart"
          className="w-48 sm:w-64 mb-4"
        />
        <h2 className="text-2xl font-semibold text-foreground">
          Your cart is empty!
        </h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven’t added anything yet.
        </p>
        <Button className="bg-primary text-foreground hover:bg-secondary">
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (


    <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-5">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">
        Your Shopping Cart
      </h1>
      {
        open && <HandleCheckOut
          isOpen={open}
          onClose={() => setOpen(false)}
          address={address}
          onProceed={handleProceed}
          onChangeAddress={() => console.log("Change address clicked")}
        />
      }

      {/* Cart Items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-accent/50 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="sm:flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="mt-4">
                  <h3 className="font-semibold text-xl text-foreground">{item.productName}</h3>
                  <p className="text-muted-foreground">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="px-2"
                  onClick={() => handleRemove(item)}
                >
                  -
                </Button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  className="px-2"
                  onClick={() => handleQuantityChange(item)}
                >
                  +
                </Button>
              </div>

              <div className="flex flex-col items-end gap-1">
                <p className="font-semibold text-foreground">
                  ₹{item.price * item.quantity}
                </p>
                <Trash2
                  size={18}
                  onClick={() => handleRemove(item, true)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="bg-accent/60 rounded-lg p-5 shadow-md h-fit">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Order Summary
          </h2>
          <div className="flex justify-between mb-2 text-sm text-foreground/90">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm text-foreground/90">
            <span>Shipping</span>
            <span>₹50</span>
          </div>
          <div className="border-t border-border my-3"></div>
          <div className="flex justify-between text-base font-semibold text-foreground">
            <span>Total</span>
            <span>₹{subtotal + 50}</span>
          </div>

          <Button className="w-full mt-4 bg-primary text-foreground hover:bg-secondary"
            onClick={() => handleValidate()} >
            Proceed to Checkout
          </Button>
          <Button
            variant="outline"
            className="w-full mt-2 text-foreground hover:text-background"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>

      <LoginAlertModal
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
      />
    </div>
  );
};

export default CartPage;
