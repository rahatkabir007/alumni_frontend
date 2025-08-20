import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Navigation state
    activeSection: 'basic-info',

    // Loading states
    isRefreshing: false,
    hasTriedFetch: false,

    // Profile data cache
    profileCache: null,
    lastFetchTime: null,

    // UI states
    sidebarCollapsed: false,

    // Modal states
    modals: {
        passwordChange: false,
        verification: false,
        userDetails: false,
    },

    // Admin/Management states
    userManagement: {
        activeTab: 'all-users',
        currentPage: 1,
        searchTerm: '',
        confirmModal: {
            open: false,
            type: '',
            user: null,
            loading: false
        },
        userDetailsModal: {
            isOpen: false,
            userId: null
        }
    },

    // Gallery Management states
    galleryManagement: {
        activeTab: 'pending_approval',
        currentPage: 1,
        yearFilter: '',
        selectedImage: null,
        processingIds: []
    }
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        // Navigation actions
        setActiveSection: (state, action) => {
            state.activeSection = action.payload;
        },

        // Loading actions
        setIsRefreshing: (state, action) => {
            state.isRefreshing = action.payload;
        },

        setHasTriedFetch: (state, action) => {
            state.hasTriedFetch = action.payload;
        },

        // Profile cache actions
        setProfileCache: (state, action) => {
            state.profileCache = action.payload;
            state.lastFetchTime = Date.now();
        },

        clearProfileCache: (state) => {
            state.profileCache = null;
            state.lastFetchTime = null;
        },

        // UI actions
        setSidebarCollapsed: (state, action) => {
            state.sidebarCollapsed = action.payload;
        },

        // Modal actions
        setModalState: (state, action) => {
            const { modalName, isOpen } = action.payload;
            state.modals[modalName] = isOpen;
        },

        // User Management actions
        setUserManagementState: (state, action) => {
            const { key, value } = action.payload;
            state.userManagement[key] = value;
        },

        setUserManagementTab: (state, action) => {
            state.userManagement.activeTab = action.payload;
            state.userManagement.currentPage = 1; // Reset page when changing tabs
        },

        setUserManagementPage: (state, action) => {
            state.userManagement.currentPage = action.payload;
        },

        setUserManagementSearch: (state, action) => {
            state.userManagement.searchTerm = action.payload;
            state.userManagement.currentPage = 1; // Reset page when searching
        },

        setConfirmModal: (state, action) => {
            state.userManagement.confirmModal = action.payload;
        },

        setUserDetailsModal: (state, action) => {
            state.userManagement.userDetailsModal = action.payload;
        },

        // Gallery Management actions
        setGalleryManagementState: (state, action) => {
            const { key, value } = action.payload;
            state.galleryManagement[key] = value;
        },

        setGalleryManagementTab: (state, action) => {
            state.galleryManagement.activeTab = action.payload;
            state.galleryManagement.currentPage = 1; // Reset page when changing tabs
        },

        setGalleryManagementPage: (state, action) => {
            state.galleryManagement.currentPage = action.payload;
        },

        setGalleryYearFilter: (state, action) => {
            state.galleryManagement.yearFilter = action.payload;
            state.galleryManagement.currentPage = 1; // Reset page when filtering
        },

        setSelectedImage: (state, action) => {
            state.galleryManagement.selectedImage = action.payload;
        },

        addProcessingId: (state, action) => {
            if (!state.galleryManagement.processingIds.includes(action.payload)) {
                state.galleryManagement.processingIds.push(action.payload);
            }
        },

        removeProcessingId: (state, action) => {
            state.galleryManagement.processingIds = state.galleryManagement.processingIds.filter(
                id => id !== action.payload
            );
        },

        // Reset actions
        resetUserManagement: (state) => {
            state.userManagement = initialState.userManagement;
        },

        resetGalleryManagement: (state) => {
            state.galleryManagement = initialState.galleryManagement;
        },

        resetProfile: () => initialState
    }
});

export const {
    // Navigation
    setActiveSection,

    // Loading
    setIsRefreshing,
    setHasTriedFetch,

    // Profile cache
    setProfileCache,
    clearProfileCache,

    // UI
    setSidebarCollapsed,

    // Modals
    setModalState,

    // User Management
    setUserManagementState,
    setUserManagementTab,
    setUserManagementPage,
    setUserManagementSearch,
    setConfirmModal,
    setUserDetailsModal,

    // Gallery Management
    setGalleryManagementState,
    setGalleryManagementTab,
    setGalleryManagementPage,
    setGalleryYearFilter,
    setSelectedImage,
    addProcessingId,
    removeProcessingId,

    // Reset
    resetUserManagement,
    resetGalleryManagement,
    resetProfile
} = profileSlice.actions;

// Selectors
export const selectActiveSection = (state) => state.profile.activeSection;
export const selectIsRefreshing = (state) => state.profile.isRefreshing;
export const selectHasTriedFetch = (state) => state.profile.hasTriedFetch;
export const selectProfileCache = (state) => state.profile.profileCache;
export const selectSidebarCollapsed = (state) => state.profile.sidebarCollapsed;
export const selectModalState = (modalName) => (state) => state.profile.modals[modalName];
export const selectUserManagement = (state) => state.profile.userManagement;
export const selectGalleryManagement = (state) => state.profile.galleryManagement;

export default profileSlice.reducer;