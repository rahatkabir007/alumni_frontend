"use client"
import { useState } from 'react'
import { useChangePasswordMutation, useUpdateUserMutation } from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BasicInfoDisplay from './BasicInfoDisplay'
import BasicInfoForm from './BasicInfoForm'
import PasswordChangeModal from './PasswordChangeModal'
import AccountInfo from './AccountInfo'

const BasicInfo = ({ userData, onUpdate, refetch }) => {
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
    const [isEditing, setIsEditing] = useState(false)
    const [isDataLoading, setIsDataLoading] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation()

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    const handleSave = async (values, { setSubmitting }) => {
        try {
            setIsDataLoading(true)

            // Transform data to match backend expectations
            const transformedValues = {
                ...values,
                email: values.email || userData.email,
                graduation_year: values.graduationYear || null,
                left_at: values.leftAt || null,
                isGraduated: values.isGraduated !== undefined ? values.isGraduated : true,
                graduationYear: undefined,
                joinedYear: values.joinedYear || null,
                leftAt: undefined
            };

            // Clean up undefined values
            Object.keys(transformedValues).forEach(key => {
                if (transformedValues[key] === undefined) {
                    delete transformedValues[key];
                }
            });

            const result = await updateUser({
                userId: userData.id,
                userData: transformedValues
            }).unwrap()

            onUpdate(result || { ...userData, ...values })
            setIsEditing(false)
            ToastMessage.notifySuccess('Profile updated successfully!')
            refetch()
        } catch (error) {
            console.error('Failed to update profile:', error)
            ToastMessage.notifyError(error.message || 'Failed to update profile')
        } finally {
            setSubmitting(false)
            setIsDataLoading(false)
        }
    }

    const handlePasswordChange = async (values, { setSubmitting, resetForm }) => {
        try {
            // TODO: Implement password change API call
            const result = await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            }).unwrap();

            ToastMessage.notifySuccess('Password changed successfully!');
            resetForm();
            setIsPasswordModalOpen(false);
        } catch (error) {
            console.error('Failed to change password:', error);
            ToastMessage.notifyError(error.message || 'Failed to change password');
        } finally {
            setSubmitting(false);
        }
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className={index === 6 ? "md:col-span-2" : ""}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className={`h-10 bg-gray-200 rounded animate-pulse ${index === 6 ? 'h-20' : ''}`}></div>
                </div>
            ))}
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                    <div className="flex gap-3">
                        {!isEditing && !isDataLoading && (
                            <>
                                {
                                    userData.provider.includes('email') && <BlackButton
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setIsPasswordModalOpen(true)}
                                    >
                                        Change Password
                                    </BlackButton>
                                }
                                <BlackButton size="sm" onClick={handleEdit}>
                                    Edit Information
                                </BlackButton>
                            </>
                        )}
                        {isDataLoading && (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                <span className="text-sm text-gray-600">Updating...</span>
                            </div>
                        )}
                    </div>
                </div>

                {isDataLoading ? (
                    <LoadingSkeleton />
                ) : isEditing ? (
                    <BasicInfoForm
                        userData={userData}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isLoading={isUpdating || isDataLoading}
                    />
                ) : (
                    <BasicInfoDisplay userData={userData} />
                )}

                <AccountInfo userData={userData} />
            </ElegantCard>

            {/* Password Change Modal */}
            <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={handlePasswordChange}
                isLoading={false} // TODO: Add password change loading state
            />
        </div>
    )
}

export default BasicInfo