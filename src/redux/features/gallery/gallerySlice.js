import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedGallery: null,
    isUpdating: false,
    updateError: null
};

export const gallerySlice = createSlice({
    name: 'gallerySlice',
    initialState,
    reducers: {
        setSelectedGallery: (state, action) => {
            state.selectedGallery = action.payload;
        },
        setUpdating: (state, action) => {
            state.isUpdating = action.payload;
        },
        setUpdateError: (state, action) => {
            state.updateError = action.payload;
        },
        clearGalleryState: (state) => {
            state.selectedGallery = null;
            state.isUpdating = false;
            state.updateError = null;
        }
    }
});

export const { setSelectedGallery, setUpdating, setUpdateError, clearGalleryState } = gallerySlice.actions;

export default gallerySlice.reducer;