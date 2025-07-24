"use client"
import { useEffect } from 'react'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import BlackTag from '@/components/common/BlackTag'
import { useLazyGetUserByIdQuery } from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import Image from 'next/image'

const UserDetailsModal = ({ isOpen, onClose, userId }) => {
    const [triggerGetUser, { data: userData, isLoading, error }] = useLazyGetUserByIdQuery()

    useEffect(() => {
        if (isOpen && userId) {
            triggerGetUser(userId)
        }
    }, [isOpen, userId, triggerGetUser])

    useEffect(() => {
        if (error) {
            ToastMessage.notifyError('Failed to load user details')
            onClose()
        }
    }, [error, onClose])

    const getStatusStyles = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'inactive':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const renderField = (label, value, fullWidth = false) => (
        <div className={fullWidth ? "col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
                {label}
            </label>
            <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
                {value || 'Not provided'}
            </div>
        </div>
    )

    return (
        <GlobalModal
            isModalOpen={isOpen}
            setModalHandler={onClose}
            title={userData ? `${userData.name || 'User'} Details` : 'User Details'}
            width={800}
            closeIcon={true}
        >
            <div className="p-6">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading user details...</p>
                    </div>
                ) : userData ? (
                    <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                            <div className="flex-shrink-0">
                                {userData.profilePhoto ? (
                                    <Image
                                        src={userData.profilePhoto}
                                        alt={userData.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                        width={64}
                                        height={64}
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg">
                                        {userData.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {userData.name || 'Unknown User'}
                                </h3>
                                <p className="text-gray-600">{userData.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    {/* Status Badge */}
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(userData.status)}`}>
                                        {userData.status?.charAt(0).toUpperCase() + userData.status?.slice(1) || 'Unknown'}
                                        {userData.status === 'pending' && ' (Unverified)'}
                                    </span>

                                    {/* Alumni Type */}
                                    {userData.alumni_type && (
                                        <BlackTag size="xs" className="bg-blue-50 text-blue-700 border-blue-200">
                                            {userData.alumni_type.charAt(0).toUpperCase() + userData.alumni_type.slice(1)}
                                        </BlackTag>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Roles Section */}
                        {userData.roles && userData.roles.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Roles</h4>
                                <div className="flex flex-wrap gap-2">
                                    {userData.roles.map((role, index) => (
                                        <BlackTag
                                            key={index}
                                            variant={role === 'admin' ? 'solid' : 'outline'}
                                            size="sm"
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
                            </div>
                        )}

                        {/* Basic Information */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {renderField('Full Name', userData.name)}
                                {renderField('Email', userData.email)}
                                {renderField('Phone', userData.phone)}
                                {renderField('Location', userData.location)}
                                {renderField('Profession', userData.profession)}
                                {renderField('Blood Group', userData.blood_group)}
                            </div>
                        </div>

                        {/* Education Information */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Education Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {renderField('Batch/Class', userData.batch)}
                                {renderField('Education Status', userData.isGraduated ? 'Graduated' : 'Left Early')}
                                {userData.isGraduated ?
                                    renderField('Graduation Year', userData.graduation_year) :
                                    renderField('Year Left School', userData.left_at)
                                }
                            </div>
                        </div>

                        {/* Bio Section */}
                        {userData.bio && (
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">About</h4>
                                <div className="bg-gray-50 p-4 rounded-md border">
                                    <p className="text-gray-900 whitespace-pre-wrap">{userData.bio}</p>
                                </div>
                            </div>
                        )}

                        {/* Account Information */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {renderField('User ID', userData.id)}
                                {renderField('Registration Method', userData.provider === 'google' ? 'Google' : 'Email')}
                                {renderField('Member Since', formatDate(userData.created_at))}
                                {renderField('Last Updated', formatDate(userData.updated_at))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-4xl mb-4">⚠️</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">User Not Found</h3>
                        <p className="text-gray-600">The requested user could not be found.</p>
                    </div>
                )}
            </div>
        </GlobalModal>
    )
}

export default UserDetailsModal
