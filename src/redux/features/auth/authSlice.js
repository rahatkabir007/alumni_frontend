import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    redirectPath: null,
    lastFetched: null, // Track when user data was last fetched
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.lastFetched = Date.now();
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },
        // New action to update user data without changing token
        updateUserData: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            state.lastFetched = Date.now();
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.redirectPath = null;
            state.lastFetched = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setRedirectPath: (state, action) => {
            state.redirectPath = action.payload;
        },
        clearRedirectPath: (state) => {
            state.redirectPath = null;
        },
        initializeAuth: (state, action) => {
            const { user, token } = action.payload;
            if (user && token) {
                state.user = user;
                state.token = token;
                state.isAuthenticated = true;
                state.lastFetched = Date.now();
            }
        }
    }
});

export const {
    setCredentials,
    updateUserData,
    logout,
    setLoading,
    setRedirectPath,
    clearRedirectPath,
    initializeAuth
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectRedirectPath = (state) => state.auth.redirectPath;
export const selectLastFetched = (state) => state.auth.lastFetched;