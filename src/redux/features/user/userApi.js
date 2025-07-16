import { apiSlice } from "../api/apiSlice"
import {
    setUsers,
    setSelectedUser,
    updateUser,
    removeUser,
    setLoading,
    setError
} from "./userSlice"

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all users with server-side filtering and pagination
        getUsers: builder.query({
            query: ({ page = 1, limit = 10, search = '', status = 'all', role = 'all', sortBy = 'createdAt', sortOrder = 'desc' } = {}) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                if (search) params.append('search', search)
                if (status !== 'all') params.append('status', status)
                if (role !== 'all') params.append('role', role)

                return `/users?${params.toString()}`
            },
            providesTags: ['User'],
            transformResponse: (response) => {
                if (response.success) {
                    return {
                        users: response.data.users || [],
                        total: response.data.total || 0,
                        currentPage: response.data.currentPage || 1,
                        totalPages: response.data.totalPages || 1
                    }
                }
                throw new Error(response.message || 'Failed to fetch users')
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true))
                try {
                    const { data } = await queryFulfilled
                    dispatch(setUsers(data))
                } catch (error) {
                    dispatch(setError(error.error?.message || 'Failed to fetch users'))
                }
            }
        }),

        // Get user by ID
        getUserById: builder.query({
            query: (userId) => `/users/${userId}`,
            providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data
                }
                throw new Error(response.message || 'Failed to fetch user')
            },
            async onQueryStarted(userId, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setSelectedUser(data))
                } catch (error) {
                    dispatch(setError(error.error?.message || 'Failed to fetch user'))
                }
            }
        }),

        // Update user - handles all user updates including profile, status, roles, etc.
        updateUser: builder.mutation({
            query: ({ userId, userData }) => ({
                url: `/users/${userId}`,
                method: 'PUT',
                body: userData,
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: 'User', id: userId },
                'User'
            ],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data
                }
                throw new Error(response.message || 'Failed to update user')
            },
            async onQueryStarted({ userId, userData }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(updateUser(data))
                } catch (error) {
                    dispatch(setError(error.error?.message || 'Failed to update user'))
                }
            }
        }),

        // Delete user (admin only)
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
            transformResponse: (response) => {
                if (response.success) {
                    return { userId }
                }
                throw new Error(response.message || 'Failed to delete user')
            },
            async onQueryStarted(userId, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(removeUser(userId))
                } catch (error) {
                    dispatch(setError(error.error?.message || 'Failed to delete user'))
                }
            }
        })
    })
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdateUserStatusMutation,
    useChangeUserRoleMutation,
    // Lazy queries
    useLazyGetUsersQuery,
    useLazyGetUserByIdQuery
} = userApi
