import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedPost: null,
    isUpdating: false,
    updateError: null,
    postManagement: {
        activeTab: 'pending_approval',
        currentPage: 1,
        statusFilter: 'pending_approval',
        visibilityFilter: 'all',
        selectedPost: null,
        processingIds: []
    }
};

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        },
        setUpdating: (state, action) => {
            state.isUpdating = action.payload;
        },
        setUpdateError: (state, action) => {
            state.updateError = action.payload;
        },
        clearPostsState: (state) => {
            state.selectedPost = null;
            state.isUpdating = false;
            state.updateError = null;
        },
        // Post Management actions
        setPostManagementTab: (state, action) => {
            state.postManagement.activeTab = action.payload;
            state.postManagement.statusFilter = action.payload;
            state.postManagement.currentPage = 1;
        },
        setPostManagementPage: (state, action) => {
            state.postManagement.currentPage = action.payload;
        },
        setPostStatusFilter: (state, action) => {
            state.postManagement.statusFilter = action.payload;
            state.postManagement.currentPage = 1;
        },
        setPostVisibilityFilter: (state, action) => {
            state.postManagement.visibilityFilter = action.payload;
            state.postManagement.currentPage = 1;
        },
        setSelectedPostManagement: (state, action) => {
            state.postManagement.selectedPost = action.payload;
        },
        addPostProcessingId: (state, action) => {
            if (!state.postManagement.processingIds.includes(action.payload)) {
                state.postManagement.processingIds.push(action.payload);
            }
        },
        removePostProcessingId: (state, action) => {
            state.postManagement.processingIds = state.postManagement.processingIds.filter(
                id => id !== action.payload
            );
        }
    }
});

export const {
    setSelectedPost,
    setUpdating,
    setUpdateError,
    clearPostsState,
    setPostManagementTab,
    setPostManagementPage,
    setPostStatusFilter,
    setPostVisibilityFilter,
    setSelectedPostManagement,
    addPostProcessingId,
    removePostProcessingId
} = postsSlice.actions;

// Selectors
export const selectPostManagement = (state) => state.posts.postManagement;

export default postsSlice.reducer;
