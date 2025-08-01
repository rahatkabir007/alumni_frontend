"use client"
import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import PasswordInputComponent1 from '@/components/common/PasswordInputComponent1'
import BlackButton from '@/components/common/BlackButton'

const PasswordChangeSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required('Current password is required'),
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('New password is required'),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Please confirm your new password'),
});

const PasswordChangeModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <Formik
                        initialValues={{
                            currentPassword: '',
                            newPassword: '',
                            confirmNewPassword: '',
                        }}
                        validationSchema={PasswordChangeSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            onSubmit(values, { setSubmitting, resetForm });
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="space-y-4">
                                    <PasswordInputComponent1
                                        name="currentPassword"
                                        label="Current Password"
                                        placeholder="Enter your current password"
                                        required
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                        iconColor="text-gray-400"
                                        iconHoverColor="hover:text-gray-600"
                                    />

                                    <PasswordInputComponent1
                                        name="newPassword"
                                        label="New Password"
                                        placeholder="Enter your new password"
                                        required
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                        iconColor="text-gray-400"
                                        iconHoverColor="hover:text-gray-600"
                                    />

                                    <PasswordInputComponent1
                                        name="confirmNewPassword"
                                        label="Confirm New Password"
                                        placeholder="Confirm your new password"
                                        required
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                        iconColor="text-gray-400"
                                        iconHoverColor="hover:text-gray-600"
                                    />
                                </div>

                                <div className="mt-6 flex gap-3 justify-end">
                                    <BlackButton
                                        variant="outline"
                                        size="sm"
                                        onClick={onClose}
                                        disabled={isSubmitting || isLoading}
                                    >
                                        Cancel
                                    </BlackButton>
                                    <BlackButton
                                        type="submit"
                                        size="sm"
                                        loading={isSubmitting || isLoading}
                                        disabled={isSubmitting || isLoading}
                                    >
                                        Change Password
                                    </BlackButton>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default PasswordChangeModal
