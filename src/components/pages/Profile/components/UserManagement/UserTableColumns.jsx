"use client"
import { useState } from 'react'
import { Select } from 'antd'
import BlackTag from '@/components/common/BlackTag'
import CustomSwitch from '@/components/antd/Swtich/CustomSwitch'
import ActionPopover from '@/components/antd/Popover/ActionPopover'
import UserActionsMenu from './UserActionsMenu'

const UserTableColumns = ({
    onConfirmModal,
    onRoleChange,
    onRoleRemove,
    onStatusChange,
    canModifyUser,
    canBlockUser,
    permissions,
    currentUserRoles,
    onUserClick // Add this new prop for handling user name clicks
}) => {
    const [editingStatus, setEditingStatus] = useState(null) // Track which row is being edited

    // Get status options based on current user status and user role permissions
    // MODERATOR RESTRICTION: Moderators can only edit pending users and change them to active
    const getStatusOptions = (currentStatus) => {
        const allStatusOptions = [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' }
        ]

        // Check if current user is admin or moderator
        const isCurrentUserAdmin = currentUserRoles?.includes('admin')
        const isCurrentUserModerator = currentUserRoles?.includes('moderator')

        // MODERATOR RESTRICTION: Only pending users can be edited by moderators, and only to active
        if (currentStatus === 'pending') {
            if (isCurrentUserAdmin) {
                return allStatusOptions // Admins can set to any status
            } else if (isCurrentUserModerator) {
                // MODERATOR RESTRICTION: Moderators can only move pending users to active or keep as pending
                return allStatusOptions.filter(option => option.value === 'active' || option.value === 'pending')
            }
            return allStatusOptions
        }

        // MODERATOR RESTRICTION: If user is verified (active or inactive), moderators cannot edit at all
        if (isCurrentUserAdmin) {
            // Admins can use all options except pending for verified users
            return allStatusOptions.filter(option => option.value !== 'pending')
        } else if (isCurrentUserModerator) {
            // MODERATOR RESTRICTION: Moderators cannot edit active or inactive users
            return [] // No options available for moderators on verified users
        }

        // Default: If user is verified (active or inactive), only show active and inactive
        return allStatusOptions.filter(option => option.value !== 'pending')
    }

    const getStatusStyles = (status) => {
        switch (status) {
            case 'active':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    border: 'border-green-200'
                }
            case 'inactive':
                return {
                    bg: 'bg-red-100',
                    text: 'text-red-800',
                    border: 'border-red-200'
                }
            case 'pending':
                return {
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-800',
                    border: 'border-yellow-200'
                }
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    border: 'border-gray-200'
                }
        }
    }

    const handleStatusEdit = (recordId) => {
        setEditingStatus(recordId)
    }

    const handleStatusCancel = () => {
        setEditingStatus(null)
    }

    const handleStatusSave = async (recordId, newStatus) => {
        try {
            // MODERATOR RESTRICTION: Additional check to prevent moderators from editing non-pending users
            const isCurrentUserModerator = currentUserRoles?.includes('moderator')
            const isCurrentUserAdmin = currentUserRoles?.includes('admin')

            // Get the current user's status to validate moderator actions
            const currentUserStatus = editingStatus ?
                // Find the user being edited to get their current status
                (() => {
                    // We need to pass the record to check current status
                    // This will be handled in the renderStatusField function
                    return null; // Will be checked in the function that calls this
                })() : null;

            // Block moderators from setting inactive status (this check remains)
            if (isCurrentUserModerator && !isCurrentUserAdmin && newStatus === 'inactive') {
                const { ToastMessage } = await import('@/utils/ToastMessage')
                ToastMessage.notifyWarning('Moderators cannot set users to inactive status. Only admins can block users.')
                setEditingStatus(null)
                return
            }

            await onStatusChange(recordId, newStatus)
            setEditingStatus(null)
        } catch (error) {
            // Error is handled in parent component
        }
    }

    const renderStatusField = (status, record) => {
        const currentStatus = status || 'pending'

        // MODERATOR RESTRICTION: Check if moderator can edit based on current user status
        const isCurrentUserAdmin = currentUserRoles?.includes('admin')
        const isCurrentUserModerator = currentUserRoles?.includes('moderator')

        // MODERATOR RESTRICTION: Moderators can only edit pending users
        const canModifyBasedOnRole = canModifyUser(record) &&
            (isCurrentUserAdmin || (isCurrentUserModerator && currentStatus === 'pending'))

        const isEditing = editingStatus === record.id
        const styles = getStatusStyles(currentStatus)
        const statusOptions = getStatusOptions(currentStatus) // This now considers user role restrictions

        // Additional check for moderators editing non-pending users
        if (isCurrentUserModerator && !isCurrentUserAdmin && currentStatus !== 'pending') {
            return (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles.bg} ${styles.text} ${styles.border}`} style={{ fontFamily: "Figtree, sans-serif" }}>
                    {currentStatus?.charAt(0).toUpperCase() + currentStatus?.slice(1)}
                    {currentStatus === 'pending' && (
                        <span className="ml-1 text-xs">(Unverified)</span>
                    )}
                    {/* MODERATOR RESTRICTION: Show lock icon for non-pending users when moderator */}
                    <span className="ml-1 text-xs text-gray-500" title="Moderators can only edit pending users">
                        🔒
                    </span>
                </div>
            )
        }

        if (!canModifyBasedOnRole) {
            return (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles.bg} ${styles.text} ${styles.border}`} style={{ fontFamily: "Figtree, sans-serif" }}>
                    {currentStatus?.charAt(0).toUpperCase() + currentStatus?.slice(1)}
                    {currentStatus === 'pending' && (
                        <span className="ml-1 text-xs">(Unverified)</span>
                    )}
                </div>
            )
        }

        if (isEditing) {
            return (
                <div className="flex items-center gap-2">
                    <Select
                        value={currentStatus}
                        onChange={(newStatus) => handleStatusSave(record.id, newStatus)}
                        size="small"
                        className="min-w-[110px]"
                        options={statusOptions} // Uses filtered options based on user role restrictions
                        autoFocus
                    />
                    <button
                        onClick={handleStatusCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Cancel"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )
        }

        return (
            <div className="flex items-center gap-2">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles.bg} ${styles.text} ${styles.border}`}>
                    {currentStatus?.charAt(0).toUpperCase() + currentStatus?.slice(1)}
                    {currentStatus === 'pending' && (
                        <span className="ml-1 text-xs">(Unverified)</span>
                    )}
                </div>
                {/* MODERATOR RESTRICTION: Only show edit button for pending users to moderators */}
                {(isCurrentUserAdmin || (isCurrentUserModerator && currentStatus === 'pending')) && (
                    <button
                        onClick={() => handleStatusEdit(record.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit status"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                )}
            </div>
        )
    }

    return [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (text, record) => {
                // MODERATOR RESTRICTION: Safety check - don't render admin users for moderators
                const isCurrentUserModerator = currentUserRoles?.includes('moderator')
                const isCurrentUserAdmin = currentUserRoles?.includes('admin')
                const isRecordAdmin = record.roles?.includes('admin')

                if (isCurrentUserModerator && !isCurrentUserAdmin && isRecordAdmin) {
                    return null // Don't render admin users for moderators
                }

                return (
                    <div className="flex items-center space-x-3">
                        {/* Profile Picture or Initial */}
                        <div className="flex-shrink-0">
                            {record.profilePhoto ? (
                                <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={record.profilePhoto}
                                    alt={record.name}
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                                    {record.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1" style={{ fontFamily: "Figtree, sans-serif" }}>
                            {/* Make name clickable */}
                            <button
                                onClick={() => onUserClick && onUserClick(record.id)}
                                className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer text-left truncate w-full"
                                title="Click to view user details"
                            >
                                {record.name || 'Unknown User'}
                            </button>
                            <div className="text-sm text-gray-500 truncate">
                                {record.email}
                            </div>
                            {record.alumni_type && (
                                <div className="text-xs text-gray-400 capitalize">
                                    {record.alumni_type}
                                </div>
                            )}
                        </div>
                    </div>
                )
            },
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            width: '20%',
            render: (roles, record) => {
                // MODERATOR RESTRICTION: Safety check - don't render admin users for moderators
                const isCurrentUserModerator = currentUserRoles?.includes('moderator')
                const isCurrentUserAdmin = currentUserRoles?.includes('admin')
                const isRecordAdmin = record.roles?.includes('admin')

                if (isCurrentUserModerator && !isCurrentUserAdmin && isRecordAdmin) {
                    return null // Don't render admin users for moderators
                }

                return (
                    <div className="flex flex-wrap gap-1" style={{ fontFamily: "Figtree, sans-serif" }}>
                        {roles?.map((role, index) => (
                            <BlackTag
                                key={index}
                                variant={role === 'admin' ? 'solid' : 'outline'}
                                size="xs"
                                className={
                                    role === 'admin'
                                        ? 'bg-red-600 text-white border-red-600'
                                        : role === 'moderator'
                                            ? 'border-orange-500 text-orange-600 bg-orange-50'
                                            : 'border-blue-500 text-blue-600 bg-blue-50'
                                }
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </BlackTag>
                        ))}
                    </div>
                )
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            render: (status, record) => {
                // MODERATOR RESTRICTION: Safety check - don't render admin users for moderators
                const isCurrentUserModerator = currentUserRoles?.includes('moderator')
                const isCurrentUserAdmin = currentUserRoles?.includes('admin')
                const isRecordAdmin = record.roles?.includes('admin')

                if (isCurrentUserModerator && !isCurrentUserAdmin && isRecordAdmin) {
                    return null // Don't render admin users for moderators
                }

                return renderStatusField(status, record)
            },
        },
        {
            title: 'Joined',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '15%',
            render: (date, record) => {
                // MODERATOR RESTRICTION: Safety check - don't render admin users for moderators
                const isCurrentUserModerator = currentUserRoles?.includes('moderator')
                const isCurrentUserAdmin = currentUserRoles?.includes('admin')
                const isRecordAdmin = record.roles?.includes('admin')

                if (isCurrentUserModerator && !isCurrentUserAdmin && isRecordAdmin) {
                    return null // Don't render admin users for moderators
                }

                if (!date) return <span className="text-gray-400">N/A</span>

                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })

                return (
                    <div className="text-sm" style={{ fontFamily: "Figtree, sans-serif" }}>
                        <div className="text-gray-900">{formattedDate}</div>
                        <div className="text-xs text-gray-500">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                    </div>
                )
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '15%',
            align: 'center',
            render: (_, record) => {
                // MODERATOR RESTRICTION: Safety check - don't render admin users for moderators
                const isCurrentUserModerator = currentUserRoles?.includes('moderator')
                const isCurrentUserAdmin = currentUserRoles?.includes('admin')
                const isRecordAdmin = record.roles?.includes('admin')

                if (isCurrentUserModerator && !isCurrentUserAdmin && isRecordAdmin) {
                    return null // Don't render admin users for moderators
                }

                const canModify = canModifyUser(record)

                // Show protected for admin users or if user can't modify
                if (!canModify || record.roles?.includes('admin')) {
                    return (
                        <BlackTag variant="subtle" size="xs" className="text-gray-500 bg-gray-100" style={{ fontFamily: "Figtree, sans-serif" }}>
                            {record.roles?.includes('admin') ? 'Admin Protected' : 'Protected'}
                        </BlackTag>
                    )
                }

                const menuItems = UserActionsMenu({
                    user: record,
                    onRoleChange,
                    onRoleRemove,
                    onConfirmModal,
                    permissions,
                    currentUserRoles
                })

                if (!menuItems || menuItems.length === 0) {
                    return (
                        <BlackTag variant="subtle" size="xs" className="text-gray-400">
                            No Actions
                        </BlackTag>
                    )
                }

                return (
                    <ActionPopover
                        menuItems={menuItems}
                        buttonClassName="hover:bg-gray-100 rounded-md p-1"
                    />
                )
            },
        },
    ]
}

export default UserTableColumns