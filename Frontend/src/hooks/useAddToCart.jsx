import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartAction } from "../slices/cartSlice";
import api from "../api/api";
import { useLocalStorage } from "./useLocalStorage";

const useAddToCart = () => {
    const dispatch = useDispatch();
    const [cart, setCart] = useLocalStorage("cart", []);
    const isloggedIn = useSelector((state) => state.auth.isLoggedIn);


    const handleAddToCart = async (e, product) => {
        console.log("Adding to cart:", product);
        e.stopPropagation();
        e.target.textContent = "Added!";
        setTimeout(() => {
            e.target.textContent = "Add to Cart";
        }, 500);

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
            }
        } else {
            // Update local storage cart only for guests
            cart.some((item) => item._id === product._id)
                ? setCart(
                    cart.map((item) =>
                        item._id === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                )
                :
            setCart([...cart, {
                _id: product._id,
                productName: product.productName,
                image: product.images[0].url,
                price: product.price,
                quantity: 1,
            }]);
            console.log("Added to localStorage cart");
        }
    };

    return handleAddToCart;
};

export default useAddToCart;
