import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    state: null
};

export const gallerySlice = createSlice({
    name: 'gallerySlice',
    initialState,
    reducers: {
        setState: (state, action) => {

        }
    }
});

export const { setState } = gallerySlice.actions;

export default gallerySlice.reducer;