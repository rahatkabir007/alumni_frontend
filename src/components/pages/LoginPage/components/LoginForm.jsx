"use client"
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Link from 'next/link';
import InputComponent1 from '@/components/common/InputComponent1';
import PasswordInputComponent1 from '@/components/common/PasswordInputComponent1';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(1, 'Password is required')
        .required('Password is required')
});

const LoginForm = ({ onSubmit, onGoogleLogin, isLoading, error }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="space-y-4">
                            <InputComponent1
                                name="email"
                                type="email"
                                label="Email Address"
                                placeholder="Enter your email"
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                            />

                            <PasswordInputComponent1
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
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
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Login */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onGoogleLogin}
                            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </motion.button>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <span className="text-gray-600">
                                Don&apos;t have an account?{' '}
                                <Link href="/register" className="text-black font-semibold hover:text-gray-700 transition-colors">
                                    Create Account
                                </Link>
                            </span>
                        </div>
                    </Form>
                )}
            </Formik>
        </motion.div>
    )
}

export default LoginForm
