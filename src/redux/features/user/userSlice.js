import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    users: [],
    isLoading: false,
    error: null,
    filters: {
        search: '',
        isActive: 'all',
        role: 'all',
        sortBy: 'created_at',
        sortOrder: 'desc'
    },
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload.users || []
            // Map the API response to our pagination structure
            state.pagination = {
                currentPage: action.payload.currentPage || 1,
                totalPages: action.payload.totalPages || 1,
                totalItems: action.payload.totalItems || 0,
                itemsPerPage: action.payload.itemsPerPage || 10,
                hasNextPage: action.payload.hasNextPage || false,
                hasPrevPage: action.payload.hasPrevPage || false
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        setCurrentPage: (state, action) => {
            state.pagination.currentPage = action.payload
        },
        clearUsers: (state) => {
            state.users = []
            state.pagination = initialState.pagination
        }
    }
})

export const {
    setUsers,
    setLoading,
    setError,
    setFilters,
    setCurrentPage,
    clearUsers
} = userSlice.actions

// Selectors
export const selectUsers = (state) => state.user.users
export const selectUserLoading = (state) => state.user.isLoading
export const selectUserError = (state) => state.user.error
export const selectUserFilters = (state) => state.user.filters
export const selectUserPagination = (state) => state.user.pagination

export default userSlice.reducer