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

    // Don't show if user is active or if they have already submitted verification for pending status
    if (!user || user.status === 'active') {
        return null;
    }

    // Check if user has submitted verification fields for pending status
    const hasVerificationFields = user.verification_fields &&
        (user.verification_fields.verification_images?.length > 0 ||
            Object.values(user.verification_fields.socialMedia || {}).some(link => link));

    // Don't show if user is pending and has already submitted verification OR if status is applied_for_verification
    if ((user.status === 'pending' && hasVerificationFields) || user.status === 'applied_for_verification') {
        return null;
    }

    // Show for both pending (without verification), rejected status, and applied_for_verification
    if (user.status !== 'pending' && user.status !== 'rejected' && user.status !== 'applied_for_verification') {
        return null;
    }

    const handleVerificationSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const result = await applyForVerification({
                userId: user.id,
                verificationData: values // values already contains the correct structure from modal
            }).unwrap();

            const successMessage = user.status === 'rejected'
                ? 'Verification reapplication submitted successfully!'
                : 'Verification application submitted successfully!';

            ToastMessage.notifySuccess(successMessage);
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

    const getNoticeContent = () => {
        if (user.status === 'rejected') {
            return {
                bgColor: 'bg-red-100',
                borderColor: 'border-red-500',
                textColor: 'text-red-900',
                iconColor: 'text-red-500',
                message: 'Your verification was rejected.',
                buttonText: 'Reapply for verification',
                buttonHoverColor: 'hover:text-red-900'
            };
        } else {
            return {
                bgColor: 'bg-yellow-100',
                borderColor: 'border-yellow-500',
                textColor: 'text-yellow-900',
                iconColor: 'text-yellow-500',
                message: 'Your account is pending verification.',
                buttonText: 'Apply for verification',
                buttonHoverColor: 'hover:text-yellow-900'
            };
        }
    };

    const noticeContent = getNoticeContent();

    return (
        <>
            <div className={`fixed z-50 bottom-6 right-6 ${noticeContent.bgColor} border-l-4 ${noticeContent.borderColor} ${noticeContent.textColor} px-6 py-4 rounded-lg shadow-lg`}>
                <div className="flex items-center gap-2">
                    <svg className={`w-6 h-6 ${noticeContent.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {user.status === 'rejected' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                        )}
                    </svg>
                    <span>
                        <b>{noticeContent.message}</b> <br />
                        <button
                            onClick={() => setIsVerificationModalOpen(true)}
                            className={`${noticeContent.textColor} underline ${noticeContent.buttonHoverColor} font-semibold transition-colors cursor-pointer`}
                            disabled={isApplyingForVerification}
                        >{isApplyingForVerification ? 'Processing...' : noticeContent.buttonText}</button>

                        {" "}to access all features <br /> and appear in the alumni list.
                    </span>
                </div>
            </div >

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