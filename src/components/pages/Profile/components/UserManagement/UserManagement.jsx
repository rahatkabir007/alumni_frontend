"use client"
import { useState, useEffect } from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import UserManagementHeader from './UserManagementHeader'
import UserManagementTable from './UserManagementTable'
import UserManagementModal from './UserManagementModal'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import {
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import { handleApiError } from '@/utils/errorHandler'
import '@/styles/antd.css'

const UserManagement = ({ userData }) => {
    const [activeTab, setActiveTab] = useState('all-users')
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState('desc')
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        type: '',
        user: null,
        loading: false
    })

    // Permissions
    const permissions = {
        canManageUsers: checkUserPermission(userData.roles, PERMISSIONS.MANAGE_USERS),
        canDeleteUser: checkUserPermission(userData.roles, PERMISSIONS.DELETE_USER),
        canBlockUser: checkUserPermission(userData.roles, PERMISSIONS.BLOCK_USER),
        canChangeUserRole: checkUserPermission(userData.roles, PERMISSIONS.CHANGE_USER_ROLE)
    }

    // Mutations
    const [updateUser] = useUpdateUserMutation()
    const [deleteUser] = useDeleteUserMutation()

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            setCurrentPage(1)
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
        skip: !permissions.canManageUsers
    })

    // Extract users and pagination from API response
    const users = data?.users || []
    const pagination = {
        current: currentPage,
        pageSize: data?.itemsPerPage || 10,
        total: data?.totalItems || 0,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
    }

    // Event Handlers
    const handleSearchChange = (e) => setSearchTerm(e.target.value)
    const handleTabChange = (tabId) => {
        setActiveTab(tabId)
        setCurrentPage(1)
    }

    // Updated to work with DataTable pagination
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleActiveToggle = async (userId, newStatus) => {
        try {
            await updateUser({
                userId,
                userData: { isActive: newStatus }
            }).unwrap()
            ToastMessage.notifySuccess(`User ${newStatus ? 'activated' : 'deactivated'} successfully`)
            refetch()
        } catch (error) {
            handleApiError(error, null, true, 'Failed to update user status')
        }
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

    const handleConfirmAction = async () => {
        const { type, user } = confirmModal
        setConfirmModal(prev => ({ ...prev, loading: true }))

        try {
            if (type === 'delete') {
                await deleteUser(user.id).unwrap()
                ToastMessage.notifySuccess('User deleted successfully')
            } else if (type === 'block') {
                await updateUser({
                    userId: user.id,
                    userData: { isActive: false }
                }).unwrap()
                ToastMessage.notifySuccess('User blocked successfully')
            } else if (type === 'unblock') {
                await updateUser({
                    userId: user.id,
                    userData: { isActive: true }
                }).unwrap()
                ToastMessage.notifySuccess('User unblocked successfully')
            }
            refetch()
            setConfirmModal({ open: false, type: '', user: null, loading: false })
        } catch (error) {
            handleApiError(error, null, true, `Failed to ${type} user`)
            setConfirmModal(prev => ({ ...prev, loading: false }))
        }
    }

    const openConfirmModal = (type, user) => {
        setConfirmModal({
            open: true,
            type,
            user,
            loading: false
        })
    }

    const closeConfirmModal = () => {
        setConfirmModal({ open: false, type: '', user: null, loading: false })
    }

    // Helper functions
    const isAdminUser = (user) => user.roles?.includes('admin')
    const canModifyUser = (targetUser) => !isAdminUser(targetUser)

    // Tab items configuration
    const tabItems = [
        {
            key: 'all-users',
            label: `All Users (${pagination.total || 0})`,
        },
        {
            key: 'active-users',
            label: `Active (${users.filter(u => u.isActive).length})`,
        },
        {
            key: 'blocked-users',
            label: `Blocked (${users.filter(u => !u.isActive).length})`,
        },
        {
            key: 'moderators',
            label: `Moderators (${users.filter(u => u.roles?.includes('moderator')).length})`,
        },
    ]

    // Access denied component
    if (!permissions.canManageUsers) {
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
            <UserManagementHeader
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabItems={tabItems}
                canManageUsers={permissions.canManageUsers}
                onRefresh={refetch}
                isFetching={isFetching}
            />

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

            {/* Users Table */}
            <UserManagementTable
                users={users}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={handlePageChange}
                onActiveToggle={handleActiveToggle}
                onConfirmModal={openConfirmModal}
                onRoleChange={handleRoleChange}
                canModifyUser={canModifyUser}
                canBlockUser={permissions.canBlockUser}
                permissions={permissions}
            />

            {/* Confirmation Modal */}
            <UserManagementModal
                confirmModal={confirmModal}
                onConfirm={handleConfirmAction}
                onClose={closeConfirmModal}
            />
        </div>
    )
}

export default UserManagement
