import { createSlice } from "@reduxjs/toolkit";
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
                    name: newItem.title,
                    image: newItem.images[0].url,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
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
            const {id, deletedItem} = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === id);

            if (existingItem) {
                state.totalQuantity--;

                if (existingItem.quantity === 1|| deletedItem) {
                    state.cartItems = state.cartItems.filter((item) => item.id !== id);
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
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;