import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartAction } from "../slices/cartSlice";
import api from "../api/api";
import { useLocalStorage } from "./useLocalStorage";
import React from "react";
const useAddToCart = () => {
    const dispatch = useDispatch();
    const [cart, setCart] = useLocalStorage("cart", []);
    const isloggedIn = useSelector((state) => state.auth.isLoggedIn);
    const [added, setAdded] = React.useState(false);

    const handleAddToCart = async (e, product) => {
        try {
            console.log("Adding to cart:", product);
            e.stopPropagation();
            
            // Update button state
            // const originalText = e.target.textContent;
            // e.target.textContent = "Added!";
            e.target.disabled = true;
            setAdded(true);

            // Dispatch to Redux
            dispatch(addToCartAction(product));

            // If logged in, sync with backend only (don't use localStorage)
            if (isloggedIn) {
                try {
                    await api.post('/users/addToCart', {
                        productId: product._id,
                        quantity: 1
                    });
                    console.log("Added to server cart");
                } catch (error) {
                    console.error("Error adding to cart:", error);
                    e.target.textContent = "Failed. Try again";
                }
            } else {
                // Update local storage cart only for guests
                const itemExists = cart.some((item) => item._id === product._id);
                if (itemExists) {
                    setCart(
                        cart.map((item) =>
                            item._id === product._id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    );
                } else {
                    setCart([...cart, {
                        _id: product._id,
                        productName: product.productName,
                        image: product.images[0].url,
                        price: product.price,
                        quantity: 1,
                    }]);
                }
                console.log("Added to localStorage cart");
            }

            // Reset button after delay
            setTimeout(() => {
                if (e.target) {
                    // e.target.textContent = originalText;
                    e.target.disabled = false;
                    setAdded(false);
                }
            }, 500);

            return { success: true, message: "Added to cart!" };
        } catch (error) {
            console.error("Error in handleAddToCart:", error);
            setAdded(false);
            return { success: false, message: "Failed to add to cart" };
        }
    };

    return { handleAddToCart, added };
};

export default useAddToCart;
