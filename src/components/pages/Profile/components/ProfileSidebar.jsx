"use client"
import { useState } from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import BlackButton from '@/components/common/BlackButton'
import { checkUserPermission, getHighestRole, PERMISSIONS } from '@/utils/rolePermissions'
import Image from 'next/image'

const ProfileSidebar = ({ userData, activeSection, onSectionChange, onRefresh }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const menuItems = [
        {
            id: 'basic-info',
            label: 'Basic Information',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            permission: PERMISSIONS.EDIT_PROFILE
        },
        {
            id: 'blogs',
            label: 'My Blogs',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
            permission: PERMISSIONS.POST_BLOG
        },
        {
            id: 'events',
            label: 'Events',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            permission: PERMISSIONS.JOIN_EVENT
        },
        {
            id: 'gallery',
            label: 'Gallery',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            permission: PERMISSIONS.UPLOAD_GALLERY
        },
        {
            id: 'reviews',
            label: 'Reviews & Testimonials',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            permission: PERMISSIONS.GIVE_REVIEW
        },
        // Moderator sections
        {
            id: 'announcements',
            label: 'Announcements',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            ),
            permission: PERMISSIONS.POST_ANNOUNCEMENT,
            moderatorOnly: true
        },
        // Admin sections
        {
            id: 'users',
            label: 'User Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            permission: PERMISSIONS.MANAGE_USERS,
            adminOnly: true
        }
    ]

    const filteredMenuItems = menuItems.filter(item => {
        if (!item.permission) return true
        return checkUserPermission(userData.roles, item.permission)
    })

    const highestRole = getHighestRole(userData.roles)

    return (
        <div className="space-y-6">
            {/* Profile Summary */}
            <ElegantCard hover={false}>
                <div className="text-center flex flex-col items-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                        {userData.profilePhoto ? (
                            <Image
                                src={userData.profilePhoto}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                width={128}
                                height={128}
                            />
                        ) : (
                            userData.name?.charAt(0).toUpperCase() || 'A'
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{userData.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{userData.profession || 'Alumni Member'}</p>

                    <div className="flex flex-wrap gap-1 justify-center mb-3">
                        {userData.roles?.map((role, index) => (
                            <BlackTag
                                key={index}
                                variant={role === 'admin' ? 'solid' : role === 'moderator' ? 'outline' : 'subtle'}
                                size="xs"
                                className={
                                    role === 'admin'
                                        ? 'bg-red-600 text-white'
                                        : role === 'moderator'
                                            ? 'border-orange-500 text-orange-600'
                                            : 'bg-blue-100 text-blue-600'
                                }
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </BlackTag>
                        ))}
                    </div>

                    <BlackTag variant="subtle" size="xs">
                        {userData.batch ? `Batch ${userData.batch}` : 'CIHS Alumni'}
                    </BlackTag>
                </div>
            </ElegantCard>

            {/* Navigation Menu */}
            <ElegantCard hover={false}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <nav className={`space-y-1 ${isCollapsed ? 'hidden lg:block' : 'block'}`}>
                    {filteredMenuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === item.id
                                ? 'bg-black text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                            {(item.moderatorOnly || item.adminOnly) && (
                                <BlackTag size="xs" variant="subtle" className="ml-auto">
                                    {item.adminOnly ? 'Admin' : 'Mod'}
                                </BlackTag>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="mt-4 pt-4 border-t">
                    <BlackButton
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        className="w-full"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        }
                    >
                        Refresh Data
                    </BlackButton>
                </div>
            </ElegantCard>
        </div>
    )
}

export default ProfileSidebar
