
import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    sellerProducts: []
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
        removeProduct: (state, action) => {
            state.products = state.products.filter(product => product.id !== action.payload);
        },
        clearProducts: (state) => {
            state.products = [];
        },
        setSellerProducts: (state, action) => {
            state.sellerProducts = Array.isArray(action.payload) ? action.payload : [action.payload];
        },
    },
});

export const { addProduct, removeProduct, clearProducts, setSellerProducts } = productSlice.actions;

// Memoized selector to prevent unnecessary rerenders
export const selectSellerProducts = createSelector(
    (state) => state.product.sellerProducts,
    (sellerProducts) => sellerProducts || []
);

export default productSlice.reducer;
