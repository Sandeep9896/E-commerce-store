
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    sellerProduct: []
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
        setSellerProducts: (state, action) => {
            console.log("Setting seller products:", action.payload);
            state.sellerProduct.push(action.payload);
        },
    },
});

export const { addProduct, removeProduct, clearProducts, setSellerProducts } = productSlice.actions;
export default productSlice.reducer;
