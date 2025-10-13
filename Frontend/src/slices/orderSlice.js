import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    orders: [],
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        removeOrder: (state, action) => {
            state.orders = state.orders.filter(order => order.id !== action.payload);
        },
        clearOrders: (state) => {
            state.orders = [];
        },
    },
});

export const {addOrder, removeOrder, clearOrders} = orderSlice.actions;
export default orderSlice.reducer;