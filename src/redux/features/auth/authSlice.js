import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    redirectPath: null,
    lastFetched: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;

            // Validate that user is a proper object with required fields
            if (!user || typeof user !== 'object' || !user.email || !user.id) {
                console.error('authSlice - Invalid user data provided:', user);
                console.error('authSlice - User must be an object with email and id fields');
                return; // Don't set invalid user data
            }

            // Validate token
            if (!token || typeof token !== 'string') {
                console.error('authSlice - Invalid token provided:', token);
                return;
            }

            // Normalize user data field names if needed
            const normalizedUser = {
                ...user,
                createdAt: user.createdAt || user.created_at,
                updatedAt: user.updatedAt || user.updated_at,
            };

            // Remove snake_case versions
            if (normalizedUser.created_at) delete normalizedUser.created_at;
            if (normalizedUser.updated_at) delete normalizedUser.updated_at;

            state.user = normalizedUser;
            state.token = token;
            state.isAuthenticated = true;
            state.lastFetched = Date.now();

            // Store in localStorage - ensure we're storing the complete user object
            try {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(normalizedUser));
                console.log('authSlice - Data stored in localStorage successfully');
                console.log('authSlice - Stored user:', normalizedUser.email, normalizedUser.name);
            } catch (error) {
                console.error('authSlice - Failed to store in localStorage:', error);
            }

            console.log('authSlice - Credentials set successfully for user:', normalizedUser.email);
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        updateUserData: (state, action) => {
            console.log('authSlice - updateUserData called');

            if (!state.user) {
                console.error('authSlice - Cannot update user data: no user in state');
                return;
            }

            // Normalize field names
            const normalizedData = {
                ...action.payload,
                createdAt: action.payload.createdAt || action.payload.created_at,
                updatedAt: action.payload.updatedAt || action.payload.updated_at,
            };

            // Remove snake_case versions
            if (normalizedData.created_at) delete normalizedData.created_at;
            if (normalizedData.updated_at) delete normalizedData.updated_at;

            state.user = { ...state.user, ...normalizedData };
            state.lastFetched = Date.now();

            // Update localStorage
            try {
                localStorage.setItem('user', JSON.stringify(state.user));
                console.log('authSlice - User data updated in localStorage');
            } catch (error) {
                console.error('authSlice - Failed to update localStorage:', error);
            }
        },
        logout: (state) => {
            console.log('authSlice - Logging out user');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.redirectPath = null;
            state.lastFetched = null;

            // Clear localStorage
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                console.log('authSlice - Cleared localStorage');
            } catch (error) {
                console.error('authSlice - Failed to clear localStorage:', error);
            }
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

            console.log('authSlice - initializeAuth called');

            if (user && token && typeof user === 'object' && user.email) {
                // Normalize user data
                const normalizedUser = {
                    ...user,
                    createdAt: user.createdAt || user.created_at,
                    updatedAt: user.updatedAt || user.updated_at,
                };

                // Remove snake_case versions
                if (normalizedUser.created_at) delete normalizedUser.created_at;
                if (normalizedUser.updated_at) delete normalizedUser.updated_at;

                state.user = normalizedUser;
                state.token = token;
                state.isAuthenticated = true;
                state.lastFetched = Date.now();

                console.log('authSlice - Auth initialized successfully');
            } else {
                console.error('authSlice - Invalid data for initializeAuth:', { hasUser: !!user, hasToken: !!token });
            }
        }
    }
});

export const {
    setCredentials,
    setUser,
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