import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
};

const productSlice = createSlice({
    name: 'products',
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
    },
});

export const { addProduct, removeProduct, clearProducts } = productSlice.actions;
export default productSlice.reducer;
