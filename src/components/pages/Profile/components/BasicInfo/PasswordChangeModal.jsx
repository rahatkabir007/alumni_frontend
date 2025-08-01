"use client"
import { Formik, Form } from 'formik'
import { PasswordChangeSchema } from '@/utils/validationSchemas'
import PasswordInputComponent1 from '@/components/common/PasswordInputComponent1'
import BlackButton from '@/components/common/BlackButton'
import GlobalModal from '@/components/antd/Modal/GlobalModal'

const PasswordChangeModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    if (!isOpen) return null;

    return (
        <GlobalModal
            isModalOpen={isOpen}
            onClose={onClose}
            title='Change Password'
            setModalHandler={onClose}
            width={600}
        >
            <div className="p-6">
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
                                    labelClassName='!text-lg'
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
                                    labelClassName='!text-lg'
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
                                    labelClassName='!text-lg'
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
        </GlobalModal>
    )
}

export default PasswordChangeModal


