import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    users: [],
    selectedUser: null,
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
    filters: {
        search: '',
        status: 'all', // all, active, blocked
        role: 'all', // all, user, moderator, admin
        sortBy: 'createdAt',
        sortOrder: 'desc'
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Loading states
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
        clearError: (state) => {
            state.error = null
        },

        // Users list management
        setUsers: (state, action) => {
            state.users = action.payload.users || []
            state.totalUsers = action.payload.total || 0
            state.currentPage = action.payload.currentPage || 1
            state.totalPages = action.payload.totalPages || 1
            state.isLoading = false
            state.error = null
        },
        addUser: (state, action) => {
            state.users.unshift(action.payload)
            state.totalUsers += 1
        },
        updateUser: (state, action) => {
            const index = state.users.findIndex(user => user.id === action.payload.id)
            if (index !== -1) {
                state.users[index] = { ...state.users[index], ...action.payload }
            }
            // Also update selectedUser if it's the same user
            if (state.selectedUser && state.selectedUser.id === action.payload.id) {
                state.selectedUser = { ...state.selectedUser, ...action.payload }
            }
        },
        removeUser: (state, action) => {
            state.users = state.users.filter(user => user.id !== action.payload)
            state.totalUsers -= 1
            // Clear selectedUser if it's the deleted user
            if (state.selectedUser && state.selectedUser.id === action.payload) {
                state.selectedUser = null
            }
        },

        // Selected user management
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null
        },

        // Filters and pagination
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
            state.currentPage = 1 // Reset to first page when filters change
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
        resetFilters: (state) => {
            state.filters = initialState.filters
            state.currentPage = 1
        },

        // Reset state
        resetUserState: () => initialState
    }
})

export const {
    setLoading,
    setError,
    clearError,
    setUsers,
    addUser,
    updateUser,
    removeUser,
    setSelectedUser,
    clearSelectedUser,
    setFilters,
    setCurrentPage,
    resetFilters,
    resetUserState
} = userSlice.actions

// Selectors
export const selectUsers = (state) => state.user.users
export const selectSelectedUser = (state) => state.user.selectedUser
export const selectUserLoading = (state) => state.user.isLoading
export const selectUserError = (state) => state.user.error
export const selectUserFilters = (state) => state.user.filters
export const selectUserPagination = (state) => ({
    currentPage: state.user.currentPage,
    totalPages: state.user.totalPages,
    totalUsers: state.user.totalUsers
})

// Filtered users selector
export const selectFilteredUsers = (state) => {
    const { users, filters } = state.user
    let filteredUsers = users

    // Apply search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredUsers = filteredUsers.filter(user =>
            user.name?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm)
        )
    }

    // Apply status filter
    if (filters.status !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status)
    }

    // Apply role filter
    if (filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(user =>
            user.roles?.includes(filters.role)
        )
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
        const aValue = a[filters.sortBy]
        const bValue = b[filters.sortBy]

        if (filters.sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1
        } else {
            return aValue < bValue ? 1 : -1
        }
    })

    return filteredUsers
}

// Enhanced filtered users selector with proper pagination
export const selectFilteredUsersWithPagination = (state) => {
    const { users, filters } = state.user
    const { currentPage } = state.user
    const itemsPerPage = 10

    let filteredUsers = [...users]

    // Apply search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredUsers = filteredUsers.filter(user =>
            user.name?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm)
        )
    }

    // Apply status filter
    if (filters.status !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status)
    }

    // Apply role filter
    if (filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(user =>
            user.roles?.includes(filters.role)
        )
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
        const field = filters.sortBy
        let aValue = a[field]
        let bValue = b[field]

        // Handle different field types
        if (field === 'createdAt' || field === 'updatedAt') {
            aValue = new Date(aValue || 0).getTime()
            bValue = new Date(bValue || 0).getTime()
        } else if (field === 'name' || field === 'email') {
            aValue = (aValue || '').toLowerCase()
            bValue = (bValue || '').toLowerCase()
        }

        if (filters.sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1
        } else {
            return aValue < bValue ? 1 : -1
        }
    })

    // Calculate pagination
    const totalFilteredUsers = filteredUsers.length
    const totalPages = Math.ceil(totalFilteredUsers / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
        users: paginatedUsers,
        totalUsers: totalFilteredUsers,
        totalPages,
        currentPage
    }
}

export default userSlice.reducer
