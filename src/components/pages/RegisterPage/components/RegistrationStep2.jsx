"use client"
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { RegistrationStep2Schema } from '@/utils/validationSchemas';
import PasswordInputComponent1 from '@/components/common/PasswordInputComponent1';

const RegistrationStep2 = ({ onSubmit, onBack, isLoading, submitError }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
        >
            <Formik
                initialValues={{
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={RegistrationStep2Schema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        {submitError && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                            >
                                {submitError}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <PasswordInputComponent1
                                name="password"
                                label="Password"
                                placeholder="Create a strong password"
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                                iconColor="text-gray-400"
                                iconHoverColor="hover:text-gray-600"
                            />

                            <PasswordInputComponent1
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                                iconColor="text-gray-400"
                                iconHoverColor="hover:text-gray-600"
                            />
                        </div>

                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={onBack}
                                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                            >
                                Back
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading || isSubmitting}
                                className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading || isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </motion.button>
                        </div>
                    </Form>
                )}
            </Formik>
        </motion.div>
    )
}

export default RegistrationStep2

