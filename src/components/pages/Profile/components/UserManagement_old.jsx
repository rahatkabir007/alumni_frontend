"use client"
import { useState, useEffect, useRef } from 'react'
import { Table, Pagination, Input, Tabs, Popover, Menu, Button } from 'antd'
import { SearchOutlined, MoreOutlined, EditOutlined, DeleteOutlined, StopOutlined, CheckOutlined } from '@ant-design/icons'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import CustomSwitch from '@/components/antd/Swtich/CustomSwitch'
import ConfirmationModal from '@/components/antd/Modal/ConfirmationModal'
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
        current: data?.currentPage || 1,
        pageSize: data?.itemsPerPage || 10,
        total: data?.totalItems || 0,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            setCurrentPage(1) // Reset to first page when searching
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleTabChange = (tabId) => {
        setActiveTab(tabId)
        setCurrentPage(1)
    }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page)
    }

    const handleTableChange = (pagination, filters, sorter) => {
        if (sorter.field) {
            setSortBy(sorter.field)
            setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc')
            setCurrentPage(1)
        }
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

    // Helper functions
    const isAdminUser = (user) => user.roles?.includes('admin')
    const canModifyUser = (targetUser) => !isAdminUser(targetUser)

    // Calculate tab counts (these should ideally come from a separate API endpoint)
    const getTabCounts = () => {
        return {
            'all-users': pagination.total,
            'active-users': users.filter(u => u.isActive).length,
            'blocked-users': users.filter(u => !u.isActive).length,
            'moderators': users.filter(u => u.roles?.includes('moderator')).length
        }
    }

    const tabCounts = getTabCounts()

    // User Actions Menu for Popover
    const getUserActionsMenu = (user) => {
        const canModify = canModifyUser(user)
        if (!canModify) return null

        const menuItems = []

        if (canChangeUserRole) {
            menuItems.push({
                key: 'role-user',
                label: 'Set as User',
                icon: <EditOutlined />,
                onClick: () => handleRoleChange(user.id, 'user')
            })
            menuItems.push({
                key: 'role-moderator',
                label: 'Set as Moderator',
                icon: <EditOutlined />,
                onClick: () => handleRoleChange(user.id, 'moderator')
            })
            menuItems.push({
                key: 'role-admin',
                label: 'Set as Admin',
                icon: <EditOutlined />,
                onClick: () => handleRoleChange(user.id, 'admin')
            })
            menuItems.push({ type: 'divider' })
        }

        if (canBlockUser) {
            menuItems.push({
                key: user.isActive ? 'block' : 'unblock',
                label: user.isActive ? 'Block User' : 'Unblock User',
                icon: user.isActive ? <StopOutlined /> : <CheckOutlined />,
                onClick: () => openConfirmModal(user.isActive ? 'block' : 'unblock', user)
            })
        }

        if (canDeleteUser) {
            menuItems.push({
                key: 'delete',
                label: 'Delete User',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => openConfirmModal('delete', user)
            })
        }

        return { items: menuItems }
    }

    // Table columns configuration
    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (text, record) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{record.name}</div>
                    <div className="text-sm text-gray-500">{record.email}</div>
                </div>
            ),
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => (
                <div className="flex flex-wrap gap-1">
                    {roles?.map((role, index) => (
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
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            sorter: true,
            render: (isActive, record) => (
                <div className="flex items-center gap-2">
                    <CustomSwitch
                        checked={isActive}
                        onChange={(checked) => handleActiveToggle(record.id, checked)}
                        disabled={!canModifyUser(record) || !canBlockUser}
                    />
                    <BlackTag
                        variant={isActive ? 'solid' : 'outline'}
                        size="xs"
                        className={
                            isActive
                                ? 'bg-green-600 text-white'
                                : 'border-red-500 text-red-600'
                        }
                    >
                        {isActive ? 'Active' : 'Blocked'}
                    </BlackTag>
                </div>
            ),
        },
        {
            title: 'Joined',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: true,
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_, record) => {
                const canModify = canModifyUser(record)
                if (!canModify) {
                    return (
                        <BlackTag variant="subtle" size="xs" className="text-gray-500">
                            Protected
                        </BlackTag>
                    )
                }

                const menu = getUserActionsMenu(record)
                if (!menu || menu.items.length === 0) return null

                return (
                    <Popover
                        content={<Menu {...menu} className="user-action-menu" />}
                        trigger="click"
                        placement="bottomRight"
                    >
                        <Button 
                            type="text" 
                            icon={<MoreOutlined />} 
                            size="small"
                            className="hover:bg-gray-100"
                        />
                    </Popover>
                )
            },
        },
    ]

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

    const getConfirmModalProps = () => {
        const { type, user } = confirmModal
        
        const props = {
            isModalOpen: confirmModal.open,
            setModalHandler: () => setConfirmModal({ open: false, type: '', user: null, loading: false }),
            onConfirm: handleConfirmAction,
            loading: confirmModal.loading,
            centered: true,
            width: 500,
        }

        switch (type) {
            case 'delete':
                return {
                    ...props,
                    title: 'Delete User',
                    confirmButtonTitle: 'Delete',
                    confirmButtonClassName: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
                }
            case 'block':
                return {
                    ...props,
                    title: 'Block User',
                    confirmButtonTitle: 'Block',
                    confirmButtonClassName: 'bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700',
                }
            case 'unblock':
                return {
                    ...props,
                    title: 'Unblock User',
                    confirmButtonTitle: 'Unblock',
                    confirmButtonClassName: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700',
                }
            default:
                return props
        }
    }

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