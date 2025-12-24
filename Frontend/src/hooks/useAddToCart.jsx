import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartAction } from "../slices/cartSlice";
import api from "../api/api";
import { useLocalStorage } from "./useLocalStorage";

const useAddToCart = () => {
    const dispatch = useDispatch();
    const [cart, setCart] = useLocalStorage("cart", []);
    const isloggedIn = useSelector((state) => state.auth.isLoggedIn);


    const handleAddToCart = async (e, product) => {
        console.log("Adding to cart from:", product);
        e.stopPropagation();
        e.target.textContent = "Added!";
        setTimeout(() => {
            e.target.textContent = "Add to Cart";
        }, 500);

        dispatch(addToCartAction(product));
        console.log("Added to cart:", product);

        // Update local storage cart if not logged in
        if (!isloggedIn) {
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
        }

        // If logged in, sync with backend

        try {
            if (isloggedIn) {
                await api.post('/users/addToCart', {
                    productId: product._id,
                    quantity: 1
                });
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    return handleAddToCart;
};

export default useAddToCart;
