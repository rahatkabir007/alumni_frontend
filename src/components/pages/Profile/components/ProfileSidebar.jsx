"use client"
import { useState, useMemo } from 'react'
import { useUpdateUserMutation } from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import ImageUploader from './ImageUploader'
import Image from 'next/image'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import { menuItems as baseMenuItems } from '@/datas/profilePage'

const ProfileSidebar = ({ userData, activeSection, onSectionChange, onRefresh }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [updateUser, { isLoading: isUpdatingPhoto }] = useUpdateUserMutation()
    const [isPhotoLoading, setIsPhotoLoading] = useState(false)

    // Create menu items with useMemo to prevent duplicates
    const menuItems = useMemo(() => {
        const items = [...baseMenuItems]


        if (checkUserPermission(userData.roles, PERMISSIONS.MANAGE_USERS)) {
            if (!items.some(item => item.id === 'users')) {
                items.push({
                    id: 'users',
                    label: 'User Management',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    )
                })
            }
        }

        if (checkUserPermission(userData.roles, PERMISSIONS.MANAGE_ANNOUNCEMENTS) || checkUserPermission(userData.roles, PERMISSIONS.POST_ANNOUNCEMENT)) {
            if (!items.some(item => item.id === 'announcements')) {
                items.push({
                    id: 'announcements',
                    label: 'Announcements',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                    )
                })
            }
        }

        return items
    }, [userData.roles])

    const handleProfilePhotoUpdate = async (newPhotoUrl) => {
        try {
            setIsPhotoLoading(true)
            const result = await updateUser({
                userId: userData.id,
                userData: { profilePhoto: newPhotoUrl }
            }).unwrap()

            // Refresh the entire user data to get the updated profile
            await onRefresh()
            ToastMessage.notifySuccess('Profile photo updated!')
        } catch (error) {
            console.error('Failed to update profile photo:', error)
            ToastMessage.notifyError('Failed to update profile photo')
        } finally {
            setIsPhotoLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Profile Summary */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center">
                    {/* Profile Picture */}
                    <div className="relative mb-4">
                        <div className="w-full mx-auto flex items-center justify-center text-white text-2xl font-bold overflow-hidden relative flex-col">
                            {isPhotoLoading || isUpdatingPhoto ? (
                                // Profile picture loading skeleton
                                <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                            ) : userData.profilePhoto ? (
                                <Image
                                    src={userData.profilePhoto}
                                    alt="Profile"
                                    className="w-24 h-24 object-cover rounded-full bg-gray-200"
                                    width={400}
                                    height={400}
                                    onLoad={() => setIsPhotoLoading(false)}
                                    onError={() => setIsPhotoLoading(false)}

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
                                    buttonText={isUpdatingPhoto || isPhotoLoading ? "Updating..." : "Change Photo"}
                                    disabled={isUpdatingPhoto || isPhotoLoading}
                                    icon={true}
                                />
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            Max 5MB, Square recommended
                        </p>
                    </div>

                    {/* User info with loading states */}
                    {isPhotoLoading || isUpdatingPhoto ? (
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-gray-900">{userData.name || 'Alumni'}</h2>
                            <p className="text-gray-600 text-sm">{userData.email}</p>

                            {userData.alumni_type && (
                                <p className="text-gray-500 text-sm mt-1 capitalize">{userData.alumni_type}</p>
                            )}

                            {/* Roles */}
                            {
                                (userData?.roles.includes('admin') || userData?.roles.includes('moderator')) && <div className="flex flex-wrap justify-center gap-1 mt-3">
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
                            }

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
                        </>
                    )}
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