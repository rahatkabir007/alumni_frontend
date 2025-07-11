import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    state: null
};

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setState: (state, action) => {

        }
    }
});

export const { setState } = authSlice.actions;

export default authSlice.reducer;