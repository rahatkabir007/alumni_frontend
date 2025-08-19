"use client"
import { ToastMessage } from '@/utils/ToastMessage'
import { EditOutlined, DeleteOutlined, UserDeleteOutlined, CrownOutlined } from '@ant-design/icons'


const UserActionsMenu = ({ user, onRoleChange, onRoleRemove, onConfirmModal, permissions, currentUserRoles }) => {
    const { canChangeUserRole, canDeleteUser } = permissions
    const menuItems = []

    // Check if current user is admin or moderator
    const isCurrentUserAdmin = currentUserRoles?.includes('admin')
    const isCurrentUserModerator = currentUserRoles?.includes('moderator')

    // Check user status - MODERATOR RESTRICTION: only pending users can be modified by moderators
    const userStatus = user.status || 'pending' || 'rejected'
    const isUserPending = userStatus === 'pending' || userStatus === 'rejected'
    const isUserActive = userStatus === 'active'

    // MODERATOR RESTRICTION: Moderators can only perform actions on pending users
    if (isCurrentUserModerator && !isCurrentUserAdmin && !isUserPending) {
        // Return empty menu for non-pending users when user is moderator
        return []
    }

    // Only admins can perform role management, or moderators on pending users
    const canPerformRoleActions = isCurrentUserAdmin || (isCurrentUserModerator && isUserPending)

    if (!canPerformRoleActions) {
        return []
    }

    // Handler for role changes that checks user status
    const handleRoleChange = (userId, role) => {
        // MODERATOR RESTRICTION: Additional check for moderators
        if (isCurrentUserModerator && !isCurrentUserAdmin && !isUserPending) {
            ToastMessage.notifyInfo('Moderators can only assign roles to pending users. Please activate the user first, then only admins can manage roles for active users.')
            return
        }

        if (!isUserActive && !isUserPending) {
            ToastMessage.notifyInfo(`User must be active or pending to assign ${role} role.`)
            return
        }
        onRoleChange(userId, role)
    }

    // Handler for role removal that checks user status
    const handleRoleRemove = (userId, role) => {
        // MODERATOR RESTRICTION: Additional check for moderators
        if (isCurrentUserModerator && !isCurrentUserAdmin && !isUserPending) {
            ToastMessage.notifyInfo('Moderators can only remove roles from pending users.')
            return
        }

        if (!isUserActive && !isUserPending) {
            ToastMessage.notifyInfo(`User must be active or pending to remove ${role} role.`)
            return
        }
        onRoleRemove(userId, role)
    }

    // Role management - only if user can change roles
    if (canChangeUserRole) {
        const userRoles = user.roles || []
        const isUserAdmin = userRoles.includes('admin')
        const isUserModerator = userRoles.includes('moderator')

        // Don't allow role changes on admin users (protect admins)
        if (!isUserAdmin) {
            // Moderator role management
            if (isUserModerator) {
                menuItems.push({
                    key: 'remove-moderator',
                    label: (
                        <span className={(!isUserActive && !isUserPending) ? 'text-gray-400' : ''}>
                            Remove as Moderator
                            {(!isUserActive && !isUserPending) && <span className="text-xs ml-1">(User Inactive)</span>}
                            {/* MODERATOR RESTRICTION: Show restriction for moderators */}
                            {isCurrentUserModerator && !isCurrentUserAdmin && !isUserPending && <span className="text-xs ml-1">(Admins Only)</span>}
                        </span>
                    ),
                    icon: <UserDeleteOutlined className={(!isUserActive && !isUserPending) ? 'text-gray-400' : ''} />,
                    onClick: () => handleRoleRemove(user.id, 'moderator'),
                    disabled: false // Keep clickable to show the warning
                })
            } else {
                menuItems.push({
                    key: 'set-moderator',
                    label: (
                        <span className={(!isUserActive && !isUserPending) ? 'text-gray-400' : ''}>
                            Set as Moderator
                            {(!isUserActive && !isUserPending) && <span className="text-xs ml-1">(User Inactive)</span>}
                            {/* MODERATOR RESTRICTION: Show restriction for moderators */}
                            {isCurrentUserModerator && !isCurrentUserAdmin && !isUserPending && <span className="text-xs ml-1">(Admins Only)</span>}
                        </span>
                    ),
                    icon: <EditOutlined className={(!isUserActive && !isUserPending) ? 'text-gray-400' : ''} />,
                    onClick: () => handleRoleChange(user.id, 'moderator'),
                    disabled: false // Keep clickable to show the warning
                })
            }

            // Admin role management - only admins can promote to admin
            if (isCurrentUserAdmin) {
                menuItems.push({
                    key: 'set-admin',
                    label: (
                        <span className={(!isUserActive && !isUserPending) ? 'text-gray-400' : ''}>
                            Set as Admin
                            {(!isUserActive && !isUserPending) && <span className="text-xs ml-1">(User Inactive)</span>}
                        </span>
                    ),
                    icon: <CrownOutlined className={(!isUserActive && !isUserPending) ? 'text-gray-400' : ''} />,
                    onClick: () => handleRoleChange(user.id, 'admin'),
                    disabled: false // Keep clickable to show the warning
                })
            }

            // Add divider if we have role management items
            if (menuItems.length > 0) {
                menuItems.push({ type: 'divider' })
            }
        }

        // If user is admin, show remove admin option (only admins can do this)
        if (isUserAdmin && isCurrentUserAdmin) {
            menuItems.push({
                key: 'remove-admin',
                label: 'Remove as Admin',
                icon: <UserDeleteOutlined />,
                onClick: () => onRoleRemove(user.id, 'admin')
            })
            menuItems.push({ type: 'divider' })
        }
    }

    // Delete user - only admins can delete users
    if (canDeleteUser && isCurrentUserAdmin && !user.roles?.includes('admin')) {
        menuItems.push({
            key: 'delete',
            label: 'Delete User',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => onConfirmModal('delete', user)
        })
    }

    return menuItems
}

export default UserActionsMenu