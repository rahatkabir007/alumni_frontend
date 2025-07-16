"use client"
import { useState } from 'react'
import { useUpdateUserMutation } from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import ImageUploader from './ImageUploader'
import Image from 'next/image'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'

const ProfileSidebar = ({ userData, activeSection, onSectionChange, onRefresh }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [updateUser, { isLoading: isUpdatingPhoto }] = useUpdateUserMutation()

    const handleProfilePhotoUpdate = async (newPhotoUrl) => {
        try {
            // Use the updateUser API endpoint for profile photo update
            const result = await updateUser({
                userId: userData.id,
                userData: { profilePhoto: newPhotoUrl }
            }).unwrap()

            // Refresh the entire user data to get the updated profile
            onRefresh()
            ToastMessage.notifySuccess('Profile photo updated!')
        } catch (error) {
            console.error('Failed to update profile photo:', error)
            ToastMessage.notifyError('Failed to update profile photo')
        }
    }

    const menuItems = [
        {
            id: 'basic-info',
            label: 'Basic Information',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            id: 'blogs',
            label: 'Blog Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            id: 'events',
            label: 'Event Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'gallery',
            label: 'Gallery Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'reviews',
            label: 'Reviews & Testimonials',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            )
        }
    ]

    // Add admin-only menu items
    if (checkUserPermission(userData.roles, PERMISSIONS.MANAGE_USERS)) {
        menuItems.push({
            id: 'users',
            label: 'User Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            )
        })
    }

    if (checkUserPermission(userData.roles, PERMISSIONS.MANAGE_ANNOUNCEMENTS)) {
        menuItems.push({
            id: 'announcements',
            label: 'Announcements',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            )
        })
    }

    return (
        <div className="space-y-6">
            {/* Profile Summary */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center">
                    {/* Profile Picture */}
                    <div className="relative mb-4">
                        <div className="w-full mx-auto flex items-center justify-center text-white text-2xl font-bold overflow-hidden relative flex-col">
                            {userData.profilePhoto ? (
                                <Image
                                    src={userData.profilePhoto}
                                    alt="Profile"
                                    className="w-24 h-24 object-cover rounded-full"
                                    width={96}
                                    height={96}
                                />
                            ) : (
                                <div className='w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-2xl font-bold'>
                                    {userData.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            )}

                            {/* Edit Icon Overlay */}
                            <div className="absolute bottom-0 right-16">
                                <ImageUploader
                                    onUpload={handleProfilePhotoUpdate}
                                    acceptedTypes={['image/jpeg', 'image/png', 'image/jpg']}
                                    maxSizeMB={5}
                                    buttonText={isUpdatingPhoto ? "Updating..." : "Change Photo"}
                                    disabled={isUpdatingPhoto}
                                    icon={true}
                                />
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            Max 5MB, Square recommended
                        </p>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">{userData.name || 'Alumni'}</h2>
                    <p className="text-gray-600 text-sm">{userData.email}</p>

                    {userData.profession && (
                        <p className="text-gray-500 text-sm mt-1">{userData.profession}</p>
                    )}

                    {/* Roles */}
                    <div className="flex flex-wrap justify-center gap-1 mt-3">
                        {userData.roles?.map((role, index) => (
                            <BlackTag
                                key={index}
                                variant={role === 'admin' ? 'filled' : 'outline'}
                                size="xs"
                                className={role === 'admin' ? 'bg-red-600 text-white' : ''}
                            >
                                {role}
                            </BlackTag>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                                {userData.graduationYear || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">Graduation</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                                {userData.batch || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">Batch</div>
                        </div>
                    </div>

                </div>
            </ElegantCard>

            {/* Navigation Menu */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
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
                    {menuItems.map((item) => (
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
            </ElegantCard>
        </div>
    )
}

export default ProfileSidebar