"use client"
import { useEffect, useState } from 'react'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import BlackTag from '@/components/common/BlackTag'
import BlackButton from '@/components/common/BlackButton'
import VerificationModal from '../../RegularUserComponents/BasicInfo/VerificationModal'
import { useLazyGetUserByIdQuery } from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import Image from 'next/image'

const UserDetailsModal = ({ isOpen, onClose, userId }) => {
    const [triggerGetUser, { data: userData, isLoading, error }] = useLazyGetUserByIdQuery()
    const [isViewingVerification, setIsViewingVerification] = useState(false)

    useEffect(() => {
        if (isOpen && userId) {
            // Pass as object with explicit includeDetails parameter
            triggerGetUser({ userId, includeDetails: 'true' })
        }
    }, [isOpen, userId, triggerGetUser])

    useEffect(() => {
        if (error) {
            ToastMessage.notifyError('Failed to load user details')
            onClose()
        }
    }, [error, onClose])

    // Check if user has verification fields that should be viewable
    const hasViewableVerificationFields = () => {
        if (!userData || !userData.verification_fields) return false;

        const verificationFields = userData.verification_fields;
        const hasImages = verificationFields.verification_images?.length > 0;
        const hasSocialMedia = Object.values(verificationFields.socialMedia || {}).some(link => link);

        return hasImages || hasSocialMedia;
    };

    // Check if verification details should be shown based on user status
    const shouldShowVerificationDetails = () => {
        if (!userData) return false;

        const relevantStatuses = ['applied_for_verification', 'rejected', 'active'];
        return relevantStatuses.includes(userData.status) && hasViewableVerificationFields();
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'inactive':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'rejected':
                return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'applied_for_verification':
                return 'bg-blue-100 text-blue-800 border-blue-200'
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

    const renderAdditionalInfo = () => {
        if (!userData.additional_information) return null

        const additionalInfo = typeof userData.additional_information === 'string' ?
            JSON.parse(userData.additional_information) :
            userData.additional_information

        if (!additionalInfo || Object.keys(additionalInfo).length === 0) return null

        const isStudent = userData.alumni_type === 'student'
        const isTeacher = userData.alumni_type === 'teacher'

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Additional Information
                </h4>

                <div className="space-y-4">
                    {/* Current Position & Organization (Students) */}
                    {isStudent && (additionalInfo.currentPosition || additionalInfo.organization) && (
                        <div className="grid grid-cols-2 gap-4">
                            {additionalInfo.currentPosition && renderField('Current Position', additionalInfo.currentPosition)}
                            {additionalInfo.organization && renderField('Organization', additionalInfo.organization)}
                        </div>
                    )}

                    {/* Teacher specific fields */}
                    {isTeacher && (additionalInfo.designation || additionalInfo.department) && (
                        <div className="grid grid-cols-2 gap-4">
                            {additionalInfo.designation && renderField('Designation', additionalInfo.designation)}
                            {additionalInfo.department && renderField('Department', additionalInfo.department)}
                        </div>
                    )}

                    {/* Achievements */}
                    {additionalInfo.achievements && additionalInfo.achievements.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase">
                                Achievements
                            </label>
                            <div className="space-y-2">
                                {additionalInfo.achievements.map((achievement, index) => (
                                    <div key={index} className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                                        • {achievement}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {additionalInfo.education && additionalInfo.education.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase">
                                Education
                            </label>
                            <div className="space-y-3">
                                {additionalInfo.education.map((edu, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                                        <h5 className="font-semibold text-gray-900">{edu.degree}</h5>
                                        <p className="text-gray-700">{edu.institution}</p>
                                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                                            <span>{edu.year}</span>
                                            {edu.grade && <span>{edu.grade}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quote */}
                    {additionalInfo.quotes && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase">
                                {isStudent ? 'Personal Quote' : 'Educational Philosophy'}
                            </label>
                            <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border italic">
                                "{additionalInfo.quotes}"
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            <GlobalModal
                isModalOpen={isOpen}
                setModalHandler={onClose}
                title={userData ? `${userData.name || 'User'} Profile` : 'User Profile'}
                width={900}
                closeIcon={true}
            >
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading user details...</p>
                        </div>
                    ) : userData ? (
                        <div className="space-y-8">
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
                                            {userData.status === 'applied_for_verification' ? 'Applied for Verification' :
                                                userData.status?.charAt(0).toUpperCase() + userData.status?.slice(1) || 'Unknown'}
                                            {(userData.status === 'pending' || userData.status === 'rejected') && ' (Unverified)'}
                                        </span>

                                        {/* Alumni Type */}
                                        {userData.alumni_type && (
                                            <BlackTag size="xs" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {userData.alumni_type.charAt(0).toUpperCase() + userData.alumni_type.slice(1)}
                                            </BlackTag>
                                        )}

                                        {/* Verification Details Button */}
                                        {shouldShowVerificationDetails() && (
                                            <button
                                                onClick={() => setIsViewingVerification(true)}
                                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                                                title="View verification details"
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Verification Details
                                            </button>
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

                            {/* Additional Information Section */}
                            {/* {renderAdditionalInfo()} */}

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

            {/* Verification Details Modal */}
            {shouldShowVerificationDetails() && (
                <VerificationModal
                    isOpen={isViewingVerification}
                    onClose={() => setIsViewingVerification(false)}
                    viewMode={true}
                    existingData={userData}
                    title={`${userData.name || 'User'}'s Verification Details`}
                />
            )}
        </>
    )
}

export default UserDetailsModal
