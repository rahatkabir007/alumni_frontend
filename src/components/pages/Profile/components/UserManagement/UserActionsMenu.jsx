"use client"
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
                    label: 'Remove as Moderator',
                    icon: <UserDeleteOutlined />,
                    onClick: () => onRoleRemove(user.id, 'moderator')
                })
            } else {
                menuItems.push({
                    key: 'set-moderator',
                    label: 'Set as Moderator',
                    icon: <EditOutlined />,
                    onClick: () => onRoleChange(user.id, 'moderator')
                })
            }

            // Admin role management - only non-admin users can be promoted
            menuItems.push({
                key: 'set-admin',
                label: 'Set as Admin',
                icon: <CrownOutlined />,
                onClick: () => onRoleChange(user.id, 'admin')
            })

            menuItems.push({ type: 'divider' })
        }

        // If user is admin, show remove admin option
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
