import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useApplyForVerificationMutation } from '@/redux/features/user/userApi';
import { ToastMessage } from '@/utils/ToastMessage';
import VerificationModal from '@/components/pages/Profile/components/BasicInfo/VerificationModal';

const FloatingVerificationNotice = () => {
    const user = useSelector(selectCurrentUser);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [applyForVerification, { isLoading: isApplyingForVerification }] = useApplyForVerificationMutation();

    // Don't show if user is not pending or if they have already submitted verification
    if (!user || user.status !== 'pending') {
        return null;
    }

    // Check if user has submitted verification fields
    const hasVerificationFields = user.verification_fields &&
        (user.verification_fields.verification_images?.length > 0 ||
            Object.values(user.verification_fields.socialMedia || {}).some(link => link));

    // Don't show if verification has been submitted
    if (hasVerificationFields) {
        return null;
    }

    const handleVerificationSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const result = await applyForVerification({
                userId: user.id,
                verificationData: {
                    verification_images: values.verification_images,
                    socialMedia: values.socialMedia
                }
            }).unwrap();

            ToastMessage.notifySuccess('Verification application submitted successfully!');
            resetForm();
            setIsVerificationModalOpen(false);

            // The notice will automatically disappear since the user now has verification_fields
        } catch (error) {
            console.error('Failed to apply for verification:', error);
            ToastMessage.notifyError(error.message || 'Failed to submit verification application');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed z-50 bottom-6 right-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 px-6 py-4 rounded-lg shadow-lg ">
                <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <span>
                        Your account is <b>pending verification</b>. <br />
                        <button
                            onClick={() => setIsVerificationModalOpen(true)}
                            className="text-yellow-800 underline hover:text-yellow-900 font-semibold transition-colors cursor-pointer"
                            disabled={isApplyingForVerification}
                        >
                            {isApplyingForVerification ? 'Processing...' : 'Apply for verification'}
                        </button> to access all features <br /> and appear in the alumni list.
                    </span>
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
    );
};

export default FloatingVerificationNotice;