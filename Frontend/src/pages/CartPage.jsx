import React, { useState } from "react";
import { Button } from "../components/ui/button"; // shadcn UI button (or your own)
import { Trash2 } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch();

  const cartItemsFromRedux = useSelector((state) => state.cart.cartItems);
   console.log("CartPage rendered", cartItemsFromRedux);
  const [cartItems, setCartItems] = useState(cartItemsFromRedux || []);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cartItemsFromRedux);
  }, [cartItemsFromRedux]);

  const handleQuantityChange = (item) => {
    // setCartItems((prev) =>
    //   prev.map((item) =>
    //     item.id === id
    //       ? { ...item, quantity: Math.max(1, item.quantity + delta) }
    //       : item
    //   )
    // );
    console.log("Dispatching addToCart for item:", item);
    dispatch(addToCart(item));
    
  };

  const handleRemove = (id, deletedItem=false) => {
    // setCartItems((prev) => prev.filter((item) => item.id !== id));
    dispatch(removeFromCart({id, deletedItem}));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <img
          src="/images/empty-cart.svg"
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

      {/* Cart Items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-accent/50 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-muted-foreground">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="px-2"
                  onClick={() => handleRemove(item.id)}
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
                  onClick={() => handleRemove(item.id, true)}
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

          <Button className="w-full mt-4 bg-primary text-foreground hover:bg-secondary">
            Proceed to Checkout
          </Button>
          <Button
            variant="outline"
            className="w-full mt-2 text-foreground hover:text-background"
            onClick={()=> navigate("/")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
