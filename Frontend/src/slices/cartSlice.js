import { createSlice } from "@reduxjs/toolkit";
import { set } from "lodash";
const initialState = {
    cartItems: [],
    totalQuantity: 0,
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.cartItems.find(
                (item) => item._id === newItem._id
            );

            state.totalQuantity++;

            if (!existingItem) {
                state.cartItems.push({
                    _id: newItem._id,
                    productName: newItem.productName,
                    image: newItem.images[0].url,
                    price: newItem.price,
                    quantity: 1,
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice =
                    Number(existingItem.totalPrice) + Number(newItem.price);
            }

            state.totalAmount = state.cartItems.reduce(
                (total, item) => total + Number(item.price) * Number(item.quantity),
                0
            );
        },
        removeFromCart: (state, action) => {
            const {item, deletedItem} = action.payload;
            const existingItem = state.cartItems.find((cartItem) => cartItem._id === item._id);

            if (existingItem) {
                state.totalQuantity--;

                if (existingItem.quantity === 1|| deletedItem) {
                    state.cartItems = state.cartItems.filter((cartItem) => cartItem._id !== item._id);
                } else {
                    existingItem.quantity--;
                    existingItem.totalPrice =
                        Number(existingItem.totalPrice) - Number(existingItem.price);
                }

                state.totalAmount = state.cartItems.reduce(
                    (total, item) => total + Number(item.price) * Number(item.quantity),
                    0
                );
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        }
    },
});

export const { addToCart, removeFromCart, clearCart, setCartItems } = cartSlice.actions;

export default cartSlice.reducer;