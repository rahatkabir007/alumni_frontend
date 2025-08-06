"use client"
import { useState } from 'react'
import { useApplyForVerificationMutation } from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import VerificationModal from './VerificationModal'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/redux/features/auth/authSlice'

const AccountInfo = ({ userData, onUpdate }) => {
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
    const [isViewingVerification, setIsViewingVerification] = useState(false)
    const [applyForVerification, { isLoading: isApplyingForVerification }] = useApplyForVerificationMutation()

    const dispatch = useDispatch()

    const handleVerificationSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const result = await applyForVerification({
                userId: userData.id,
                verificationData: values // values already contains the correct structure from modal
            }).unwrap()

            const successMessage = userData.status === 'rejected'
                ? 'Verification reapplication submitted successfully!'
                : 'Verification application submitted successfully!'

            ToastMessage.notifySuccess(successMessage)
            resetForm()
            setIsVerificationModalOpen(false)

            // Update user data to reflect verification status
            if (onUpdate) {
                onUpdate({
                    ...userData,
                    verification_fields: values,
                    status: userData.status === 'rejected' ? 'applied_for_verification' : userData.status
                })
            }

            dispatch(setCredentials({
                user: { ...userData, verification_fields: values },
                token: localStorage.getItem('token')
            }))
        } catch (error) {
            console.error('Failed to apply for verification:', error)
            ToastMessage.notifyError(error.message || 'Failed to submit verification application')
        } finally {
            setSubmitting(false)
        }
    }

    // Determine verification status and button text
    const hasVerificationFields = userData.verification_fields &&
        (userData.verification_fields.verification_images?.length > 0 ||
            Object.values(userData.verification_fields.socialMedia || {}).some(link => link))

    const getVerificationStatus = () => {
        if (userData.status === 'active') {
            return { text: 'Verified', color: 'text-green-600', showButton: false, showViewButton: false }
        } else if (userData.status === 'applied_for_verification') {
            return {
                text: 'Verification Application Submitted',
                color: 'text-blue-600',
                showButton: false,
                showViewButton: hasVerificationFields
            }
        } else if (userData.status === 'rejected' && !hasVerificationFields) {
            return {
                text: 'Verification Rejected',
                color: 'text-red-600',
                showButton: true,
                buttonText: 'Reapply for Verification',
                showViewButton: false
            }
        } else if (userData.status === 'rejected' && hasVerificationFields) {
            return {
                text: 'Reapplication Pending',
                color: 'text-yellow-600',
                showButton: false,
                showViewButton: true
            }
        } else if (userData.status === 'pending' && hasVerificationFields) {
            return {
                text: 'Waiting for Verification',
                color: 'text-yellow-600',
                showButton: false,
                showViewButton: true
            }
        } else if (userData.status === 'pending') {
            return {
                text: 'Not Verified',
                color: 'text-yellow-600',
                showButton: true,
                buttonText: 'Apply for Verification',
                showViewButton: false
            }
        } else {
            return { text: 'Inactive', color: 'text-red-600', showButton: false, showViewButton: false }
        }
    }

    const verificationStatus = getVerificationStatus()

    return (
        <>
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <span className="text-gray-500">User ID:</span>
                        <span className="ml-2 text-gray-900">{userData.id}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Account Status:</span>
                        <span className={`ml-2 ${verificationStatus.color}`}>
                            {verificationStatus.text}

                            {/* Action Buttons Container */}
                            <div className="inline-flex items-center gap-2 ml-2">
                                {/* Apply/Reapply Button */}
                                {verificationStatus.showButton && (
                                    <button
                                        onClick={() => setIsVerificationModalOpen(true)}
                                        className={`px-3 py-1 text-white text-xs rounded transition ${userData.status === 'rejected'
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-yellow-500 hover:bg-yellow-600'
                                            }`}
                                        type="button"
                                        disabled={isApplyingForVerification}
                                    >
                                        {isApplyingForVerification ? 'Processing...' : verificationStatus.buttonText}
                                    </button>
                                )}

                                {/* View Verification Details Button */}
                                {verificationStatus.showViewButton && (
                                    <button
                                        onClick={() => setIsViewingVerification(true)}
                                        className="px-2 py-1 text-blue-600 hover:text-blue-800 transition-colors"
                                        type="button"
                                        title="View verification details"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">Member Since:</span>
                        <span className="ml-2 text-gray-900">
                            {userData.createdAt || userData.created_at ?
                                new Date(userData.createdAt || userData.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">Last Updated:</span>
                        <span className="ml-2 text-gray-900">
                            {userData.updatedAt || userData.updated_at ?
                                new Date(userData.updatedAt || userData.updated_at).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>

                    {/* Verification Details */}
                    {hasVerificationFields && (
                        <>
                            <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">
                                    {userData.status === 'rejected' ? 'Reapplication Details' : 'Verification Details'}
                                </h5>
                                <div className="space-y-2">
                                    {userData.verification_fields?.verification_images?.length > 0 && (
                                        <div>
                                            <span className="text-gray-500">Verification Images:</span>
                                            <span className="ml-2 text-gray-900">
                                                {userData.verification_fields.verification_images.length} image(s) submitted
                                            </span>
                                        </div>
                                    )}
                                    {userData.verification_fields?.socialMedia && (
                                        <div>
                                            <span className="text-gray-500">Social Media:</span>
                                            <div className="ml-2 text-sm">
                                                {userData.verification_fields.socialMedia.linkedin && (
                                                    <div className="text-blue-600">LinkedIn: Provided</div>
                                                )}
                                                {userData.verification_fields.socialMedia.twitter && (
                                                    <div className="text-blue-600">Twitter: Provided</div>
                                                )}
                                                {userData.verification_fields.socialMedia.facebook && (
                                                    <div className="text-blue-600">Facebook: Provided</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Apply/Reapply Verification Modal */}
            <VerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                onSubmit={handleVerificationSubmit}
                isLoading={isApplyingForVerification}
                viewMode={false}
            />

            {/* View Verification Details Modal */}
            <VerificationModal
                isOpen={isViewingVerification}
                onClose={() => setIsViewingVerification(false)}
                viewMode={true}
                existingData={userData}
                title="My Verification Details"
            />
        </>
    )
}

export default AccountInfo
