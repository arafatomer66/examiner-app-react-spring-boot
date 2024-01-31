import { createSlice } from '@reduxjs/toolkit';

const subscriptions = createSlice({
    name: 'subscriptions',
    initialState: {
        subscriptions: null,
        pricingId: null,
    },
    reducers: {
        setSubscriptions: (state, { payload }) => {
            state.subscriptions = payload;
        },
        setPricingId: (state, { payload }) => {
            state.pricingId = payload;
        },
    }
});

export const selectSubscription = state => { return state.subscriptions.subscriptions };
export const selectPricingId = state => { return state.subscriptions.pricingId };

export const { setSubscriptions, setPricingId } = subscriptions.actions;

export default subscriptions.reducer;