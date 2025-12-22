import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "../slices/cartSlice";
import api from "../api/api";

const useAddToCart = () => {
    const dispatch = useDispatch();


    const handleAddToCart = async (e, product) => {
        console.log("Adding to cart from:", product);
        e.stopPropagation();
        e.target.textContent = "Added!";
        setTimeout(() => {
            e.target.textContent = "Add to Cart";
        }, 500);

        dispatch(addToCartAction(product));
        console.log("Added to cart:", product);

        try {
            await api.post('/users/addToCart', {
                productId: product._id,
                quantity: 1
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    return handleAddToCart;
};

export default useAddToCart;
