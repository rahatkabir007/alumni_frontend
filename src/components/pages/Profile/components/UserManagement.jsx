"use client"
import { useState, useEffect, useRef } from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import Pagination from '@/components/common/Pagination'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import {
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import { handleApiError } from '@/utils/errorHandler'

const UserManagement = ({ userData }) => {
    const [activeTab, setActiveTab] = useState('all-users')
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [openDropdown, setOpenDropdown] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState('desc')
    const dropdownRef = useRef(null)

    // Permissions
    const canManageUsers = checkUserPermission(userData.roles, PERMISSIONS.MANAGE_USERS)
    const canDeleteUser = checkUserPermission(userData.roles, PERMISSIONS.DELETE_USER)
    const canBlockUser = checkUserPermission(userData.roles, PERMISSIONS.BLOCK_USER)
    const canChangeUserRole = checkUserPermission(userData.roles, PERMISSIONS.CHANGE_USER_ROLE)

    // Mutations
    const [updateUser] = useUpdateUserMutation()
    const [deleteUser] = useDeleteUserMutation()

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            setCurrentPage(1) // Reset to first page when searching
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Fetch users with server-side filtering
    const { data, isLoading, isFetching, error, refetch } = useGetUsersQuery({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        isActive: activeTab === 'active-users' ? true : activeTab === 'blocked-users' ? false : 'all',
        role: activeTab === 'moderators' ? 'moderator' : 'all',
        sortBy,
        sortOrder
    }, {
        skip: !canManageUsers
    })

    // Extract users and pagination from API response
    const users = data?.users || []
    const pagination = {
        currentPage: data?.currentPage || 1,
        totalPages: data?.totalPages || 1,
        totalItems: data?.totalItems || 0,
        itemsPerPage: data?.itemsPerPage || 10,
        hasNextPage: data?.hasNextPage || false,
        hasPrevPage: data?.hasPrevPage || false
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearchChange = (value) => {
        setSearchTerm(value)
    }

    const handleTabChange = (tabId) => {
        setActiveTab(tabId)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleSort = (field) => {
        const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
        setSortBy(field)
        setSortOrder(newOrder)
        setCurrentPage(1)
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUser({
                userId,
                userData: { roles: [newRole] }
            }).unwrap()
            ToastMessage.notifySuccess(`User role updated to ${newRole}`)
            refetch()
        } catch (error) {
            handleApiError(error, null, true, 'Failed to update user role')
        }
    }

    const handleUserAction = async (userId, action) => {
        try {
            if (action === 'block' || action === 'unblock') {
                const isActive = action === 'block' ? false : true
                await updateUser({
                    userId,
                    userData: { isActive }
                }).unwrap()
                ToastMessage.notifySuccess(`User ${action}ed successfully`)
            } else if (action === 'delete') {
                if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                    await deleteUser(userId).unwrap()
                    ToastMessage.notifySuccess('User deleted successfully')
                }
            }
            refetch()
        } catch (error) {
            handleApiError(error, null, true, `Failed to ${action} user`)
        }
    }

    // Helper functions
    const isAdminUser = (user) => user.roles?.includes('admin')
    const canModifyUser = (targetUser) => !isAdminUser(targetUser)

    // Calculate tab counts (these should ideally come from a separate API endpoint)
    const getTabCounts = () => {
        return {
            'all-users': pagination.totalItems,
            'active-users': users.filter(u => u.isActive).length,
            'blocked-users': users.filter(u => !u.isActive).length,
            'moderators': users.filter(u => u.roles?.includes('moderator')).length
        }
    }

    const tabCounts = getTabCounts()

    const ActionDropdown = ({ user }) => {
        const isOpen = openDropdown === user.id
        const canModify = canModifyUser(user)

        if (!canModify) {
            return (
                <BlackTag variant="subtle" size="xs" className="text-gray-500">
                    Protected
                </BlackTag>
            )
        }

        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setOpenDropdown(isOpen ? null : user.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/20 rounded"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                        <div className="py-1">
                            {canChangeUserRole && (
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Change Role</label>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleRoleChange(user.id, e.target.value)
                                                setOpenDropdown(null)
                                            }
                                        }}
                                        className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                        defaultValue=""
                                    >
                                        <option value="">Select Role</option>
                                        <option value="user">User</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            )}

                            {canBlockUser && (
                                <button
                                    onClick={() => {
                                        handleUserAction(user.id, user.isActive ? 'block' : 'unblock')
                                        setOpenDropdown(null)
                                    }}
                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                    </svg>
                                    {user.isActive ? 'Block User' : 'Unblock User'}
                                </button>
                            )}

                            {canDeleteUser && (
                                <button
                                    onClick={() => {
                                        handleUserAction(user.id, 'delete')
                                        setOpenDropdown(null)
                                    }}
                                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete User
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const tabs = [
        { id: 'all-users', label: 'All Users', count: tabCounts['all-users'] },
        { id: 'active-users', label: 'Active', count: tabCounts['active-users'] },
        { id: 'blocked-users', label: 'Blocked', count: tabCounts['blocked-users'] },
        { id: 'moderators', label: 'Moderators', count: tabCounts['moderators'] }
    ]

    const SortableHeader = ({ field, children }) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1">
                {children}
                {sortBy === field && (
                    <span className="text-black">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                )}
            </div>
        </th>
    )

    if (!canManageUsers) {
        return (
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h4>
                    <p className="text-gray-600">You don&apos;t have permission to manage users</p>
                </div>
            </ElegantCard>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                    <div className="flex items-center gap-2">
                        {canManageUsers && <BlackTag variant="outline">Admin Access</BlackTag>}
                    </div>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                                <BlackTag variant="subtle" size="xs" className="ml-2">
                                    {tab.count}
                                </BlackTag>
                            </button>
                        ))}
                    </nav>
                </div>
            </ElegantCard>

            {/* Error Display */}
            {error && (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-6 text-red-600">
                        <p>Error: {error.message || 'Something went wrong'}</p>
                        <BlackButton
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="mt-2"
                        >
                            Try Again
                        </BlackButton>
                    </div>
                </ElegantCard>
            )}

            {/* Users List */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading users...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <SortableHeader field="name">User</SortableHeader>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Roles
                                        </th>
                                        <SortableHeader field="isActive">Status</SortableHeader>
                                        <SortableHeader field="created_at">Joined</SortableHeader>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles?.map((role, index) => (
                                                        <BlackTag
                                                            key={index}
                                                            variant={role === 'admin' ? 'solid' : 'outline'}
                                                            size="xs"
                                                            className={
                                                                role === 'admin'
                                                                    ? 'bg-red-600 text-white'
                                                                    : role === 'moderator'
                                                                        ? 'border-orange-500 text-orange-600'
                                                                        : 'border-blue-500 text-blue-600'
                                                            }
                                                        >
                                                            {role}
                                                        </BlackTag>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <BlackTag
                                                    variant={user.isActive ? 'solid' : 'outline'}
                                                    size="xs"
                                                    className={
                                                        user.isActive
                                                            ? 'bg-green-600 text-white'
                                                            : 'border-red-500 text-red-600'
                                                    }
                                                >
                                                    {user.isActive ? 'Active' : 'Blocked'}
                                                </BlackTag>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <ActionDropdown user={user} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            itemsPerPage={pagination.itemsPerPage}
                            onPageChange={handlePageChange}
                            isLoading={isFetching}
                        />

                        {users.length === 0 && !isLoading && !isFetching && (
                            <div className="text-center py-8">
                                <p className="text-gray-600">No users found matching your criteria</p>
                            </div>
                        )}
                    </>
                )}
            </ElegantCard>
        </div>
    )
}

export default UserManagement