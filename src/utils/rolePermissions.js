// Define all permissions
export const PERMISSIONS = {
    // Basic user permissions
    POST_BLOG: 'post_blog',
    EDIT_OWN_BLOG: 'edit_own_blog',
    DELETE_OWN_BLOG: 'delete_own_blog',
    JOIN_EVENT: 'join_event',
    UPLOAD_GALLERY: 'upload_gallery',
    GIVE_REVIEW: 'give_review',
    SEND_MESSAGE: 'send_message',
    EDIT_PROFILE: 'edit_profile',

    // Moderator permissions
    APPROVE_BLOG: 'approve_blog',
    CREATE_EVENT: 'create_event',
    MANAGE_EVENT: 'manage_event',
    POST_ANNOUNCEMENT: 'post_announcement',
    APPROVE_REVIEW: 'approve_review',
    MODERATE_CONTENT: 'moderate_content',
    MANAGE_USERS: 'manage_users', // Moved to moderator level to allow user management access
    MANAGE_GALLERY: 'manage_gallery', // Allows managing gallery content
    MANAGE_BLOGS: 'manage_blogs', // Allows managing blog content
    MANAGE_EVENTS: 'manage_events', // Allows managing event content
    // MODERATOR RESTRICTION: BLOCK_USER permission is split - moderators can activate (pending to active) but not deactivate (active to inactive)

    // Admin permissions  
    DELETE_USER: 'delete_user',
    BLOCK_USER: 'block_user', // Full blocking permission (including setting to inactive) - ADMIN ONLY
    CHANGE_USER_ROLE: 'change_user_role',
    MANAGE_ANNOUNCEMENTS: 'manage_announcements',
    DELETE_ANY_BLOG: 'delete_any_blog',
    DELETE_ANY_EVENT: 'delete_any_event',
    SYSTEM_SETTINGS: 'system_settings'
}

// Define role-based permissions
export const ROLE_PERMISSIONS = {
    user: [
        PERMISSIONS.POST_BLOG,
        PERMISSIONS.EDIT_OWN_BLOG,
        PERMISSIONS.DELETE_OWN_BLOG,
        PERMISSIONS.JOIN_EVENT,
        PERMISSIONS.UPLOAD_GALLERY,
        PERMISSIONS.GIVE_REVIEW,
        PERMISSIONS.SEND_MESSAGE,
        PERMISSIONS.EDIT_PROFILE
    ],
    moderator: [
        // Include all user permissions
        PERMISSIONS.POST_BLOG,
        PERMISSIONS.EDIT_OWN_BLOG,
        PERMISSIONS.DELETE_OWN_BLOG,
        PERMISSIONS.JOIN_EVENT,
        PERMISSIONS.UPLOAD_GALLERY,
        PERMISSIONS.GIVE_REVIEW,
        PERMISSIONS.SEND_MESSAGE,
        PERMISSIONS.EDIT_PROFILE,
        // Moderator specific permissions
        PERMISSIONS.MANAGE_USERS, // Can access user management
        PERMISSIONS.MANAGE_GALLERY,
        PERMISSIONS.MANAGE_BLOGS,
        PERMISSIONS.MANAGE_EVENTS,
        PERMISSIONS.APPROVE_BLOG,
        PERMISSIONS.CREATE_EVENT,
        PERMISSIONS.MANAGE_EVENT,
        PERMISSIONS.POST_ANNOUNCEMENT,
        PERMISSIONS.APPROVE_REVIEW,
        PERMISSIONS.MODERATE_CONTENT
        // MODERATOR RESTRICTION: Moderators do NOT have BLOCK_USER permission - they can activate users (pending to active) but not deactivate (active to inactive)
    ],
    admin: [
        // All permissions including full blocking capability
        PERMISSIONS.DELETE_USER,
        PERMISSIONS.BLOCK_USER, // Full blocking permission (can set users to inactive) - ADMIN EXCLUSIVE
        PERMISSIONS.CHANGE_USER_ROLE,
        PERMISSIONS.MANAGE_ANNOUNCEMENTS,
        PERMISSIONS.DELETE_ANY_BLOG,
        PERMISSIONS.DELETE_ANY_EVENT,
        PERMISSIONS.SYSTEM_SETTINGS,
        // All other permissions
        ...Object.values(PERMISSIONS)
    ]
}

// // Fix the circular reference issue
// ROLE_PERMISSIONS.moderator = [
//     ...ROLE_PERMISSIONS.user,
//     PERMISSIONS.APPROVE_BLOG,
//     PERMISSIONS.CREATE_EVENT,
//     PERMISSIONS.MANAGE_EVENT,
//     PERMISSIONS.POST_ANNOUNCEMENT,
//     PERMISSIONS.APPROVE_REVIEW,
//     PERMISSIONS.MODERATE_CONTENT
// ]

/**
 * Check if user has a specific permission
 * @param {Array} userRoles - Array of user roles ['user', 'moderator', 'admin']
 * @param {string} permission - Permission to check
 * @returns {boolean} - Whether user has the permission
 */
export const checkUserPermission = (userRoles, permission) => {
    if (!userRoles || !Array.isArray(userRoles)) return false

    // Check if any of the user's roles has the required permission
    return userRoles.some(role => {
        const rolePermissions = ROLE_PERMISSIONS[role.toLowerCase()]
        return rolePermissions && rolePermissions.includes(permission)
    })
}

/**
 * Check if user has any of the specified permissions
 * @param {Array} userRoles - Array of user roles
 * @param {Array} permissions - Array of permissions to check
 * @returns {boolean} - Whether user has any of the permissions
 */
export const checkAnyPermission = (userRoles = [], permissions = []) => {
    return permissions.some(permission => checkUserPermission(userRoles, permission))
}

/**
 * Check if user has all specified permissions
 * @param {Array} userRoles - Array of user roles
 * @param {Array} permissions - Array of permissions to check
 * @returns {boolean} - Whether user has all of the permissions
 */
export const checkAllPermissions = (userRoles = [], permissions = []) => {
    return permissions.every(permission => checkUserPermission(userRoles, permission))
}

/**
 * Get all permissions for a user based on their roles
 * @param {Array} userRoles - Array of user roles
 * @returns {Array} - Array of all permissions the user has
 */
export const getUserPermissions = (userRoles = []) => {
    const allPermissions = new Set()

    userRoles.forEach(role => {
        const rolePermissions = ROLE_PERMISSIONS[role] || []
        rolePermissions.forEach(permission => allPermissions.add(permission))
    })

    return Array.from(allPermissions)
}

/**
 * Check if user is admin (helper function)
 * @param {Array} userRoles - Array of user roles
 * @returns {boolean} - Whether user is admin
 */
export const isAdmin = (userRoles = []) => {
    return userRoles.includes('admin')
}

/**
 * Check if user is moderator or higher (helper function)
 * @param {Array} userRoles - Array of user roles
 * @returns {boolean} - Whether user is moderator or higher
 */
export const isModeratorOrHigher = (userRoles = []) => {
    return userRoles.includes('admin') || userRoles.includes('moderator')
}

/**
 * Get the highest role priority (admin > moderator > user)
 * @param {Array} userRoles - Array of user roles
 * @returns {string} - Highest priority role
 */
export const getHighestRole = (userRoles) => {
    if (!userRoles || !Array.isArray(userRoles)) return 'user'

    const rolePriority = { admin: 3, moderator: 2, user: 1 }

    let highestRole = 'user'
    let highestPriority = 0

    userRoles.forEach(role => {
        const priority = rolePriority[role.toLowerCase()] || 0
        if (priority > highestPriority) {
            highestPriority = priority
            highestRole = role.toLowerCase()
        }
    })

    return highestRole
}

