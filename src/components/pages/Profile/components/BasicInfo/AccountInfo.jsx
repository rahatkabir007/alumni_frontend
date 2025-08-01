"use client"
import { useState } from 'react'
import { useApplyForVerificationMutation } from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import VerificationModal from './VerificationModal'

const AccountInfo = ({ userData, onUpdate }) => {
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
    const [applyForVerification, { isLoading: isApplyingForVerification }] = useApplyForVerificationMutation()

    const handleVerificationSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const result = await applyForVerification({
                userId: userData.id,
                verificationData: values // values already contains the correct structure from modal
            }).unwrap()

            const successMessage = userData.status === 'rejected'
                ? 'Verification reapplication submitted successfully!'
                : 'Verification application submitted successfully!';

            ToastMessage.notifySuccess(successMessage)
            resetForm()
            setIsVerificationModalOpen(false)

            // Update user data to reflect verification status
            if (onUpdate) {
                onUpdate({
                    ...userData,
                    verification_fields: values
                })
            }
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
            return { text: 'Verified', color: 'text-green-600', showButton: false }
        } else if (userData.status === 'rejected' && !hasVerificationFields) {
            return { text: 'Verification Rejected', color: 'text-red-600', showButton: true, buttonText: 'Reapply for Verification' }
        } else if (userData.status === 'rejected' && hasVerificationFields) {
            return { text: 'Reapplication Pending', color: 'text-yellow-600', showButton: false }
        } else if (userData.status === 'pending' && hasVerificationFields) {
            return { text: 'Waiting for Verification', color: 'text-yellow-600', showButton: false }
        } else if (userData.status === 'pending') {
            return { text: 'Not Verified', color: 'text-yellow-600', showButton: true, buttonText: 'Apply for Verification' }
        } else {
            return { text: 'Inactive', color: 'text-red-600', showButton: false }
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
                            {verificationStatus.showButton && (
                                <button
                                    onClick={() => setIsVerificationModalOpen(true)}
                                    className={`ml-2 px-3 py-1 text-white text-xs rounded transition ${userData.status === 'rejected'
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-yellow-500 hover:bg-yellow-600'
                                        }`}
                                    type="button"
                                    disabled={isApplyingForVerification}
                                >
                                    {isApplyingForVerification ? 'Processing...' : verificationStatus.buttonText}
                                </button>
                            )}
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

            {/* Verification Modal */}
            <VerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                onSubmit={handleVerificationSubmit}
                isLoading={isApplyingForVerification}
            />
        </>
    )
}

export default AccountInfo
