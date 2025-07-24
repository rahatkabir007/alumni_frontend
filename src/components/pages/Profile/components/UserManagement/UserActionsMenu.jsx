"use client"
import { ToastMessage } from '@/utils/ToastMessage'
import { EditOutlined, DeleteOutlined, UserDeleteOutlined, CrownOutlined } from '@ant-design/icons'


const UserActionsMenu = ({ user, onRoleChange, onRoleRemove, onConfirmModal, permissions, currentUserRoles }) => {
    const { canChangeUserRole, canDeleteUser } = permissions
    const menuItems = []

    // Check if current user is admin
    const isCurrentUserAdmin = currentUserRoles?.includes('admin')

    // Only admins can perform these actions for now
    if (!isCurrentUserAdmin) {
        return []
    }

    // Check user status
    const userStatus = user.status || 'pending'
    const isUserActive = userStatus === 'active'

    // Handler for role changes that checks user status
    const handleRoleChange = (userId, role) => {
        if (!isUserActive) {
            ToastMessage.notifyInfo(`User must be active to assign ${role} role. Please activate the user first.`)
            return
        }
        onRoleChange(userId, role)
    }

    // Handler for role removal that checks user status
    const handleRoleRemove = (userId, role) => {
        if (!isUserActive) {
            ToastMessage.notifyInfo(`User must be active to remove ${role} role. Please activate the user first.`)
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
                        <span className={!isUserActive ? 'text-gray-400' : ''}>
                            Remove as Moderator
                            {!isUserActive && <span className="text-xs ml-1">(Requires Active)</span>}
                        </span>
                    ),
                    icon: <UserDeleteOutlined className={!isUserActive ? 'text-gray-400' : ''} />,
                    onClick: () => handleRoleRemove(user.id, 'moderator'),
                    disabled: false // Keep clickable to show the warning
                })
            } else {
                menuItems.push({
                    key: 'set-moderator',
                    label: (
                        <span className={!isUserActive ? 'text-gray-400' : ''}>
                            Set as Moderator
                            {!isUserActive && <span className="text-xs ml-1">(Requires Active)</span>}
                        </span>
                    ),
                    icon: <EditOutlined className={!isUserActive ? 'text-gray-400' : ''} />,
                    onClick: () => handleRoleChange(user.id, 'moderator'),
                    disabled: false // Keep clickable to show the warning
                })
            }

            // Admin role management - only non-admin users can be promoted
            menuItems.push({
                key: 'set-admin',
                label: (
                    <span className={!isUserActive ? 'text-gray-400' : ''}>
                        Set as Admin
                        {!isUserActive && <span className="text-xs ml-1">(Requires Active)</span>}
                    </span>
                ),
                icon: <CrownOutlined className={!isUserActive ? 'text-gray-400' : ''} />,
                onClick: () => handleRoleChange(user.id, 'admin'),
                disabled: false // Keep clickable to show the warning
            })

            // Add divider if we have role management items
            if (menuItems.length > 0) {
                menuItems.push({ type: 'divider' })
            }
        }

        // If user is admin, show remove admin option (admin removal doesn't require active status check)
        if (isUserAdmin) {
            menuItems.push({
                key: 'remove-admin',
                label: 'Remove as Admin',
                icon: <UserDeleteOutlined />,
                onClick: () => onRoleRemove(user.id, 'admin')
            })
            menuItems.push({ type: 'divider' })
        }
    }

    // Delete user - only if user can delete and target is not admin
    if (canDeleteUser && !user.roles?.includes('admin')) {
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