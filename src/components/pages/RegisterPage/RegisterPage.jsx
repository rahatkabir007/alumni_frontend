"use client"
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice';
import { ToastMessage } from '@/utils/ToastMessage';
import InputComponent1 from '@/components/common/InputComponent1';
import PasswordInputComponent1 from '@/components/common/PasswordInputComponent1';

const RegisterSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
});

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [submitError, setSubmitError] = useState(null);

    const [register, { isLoading }] = useRegisterMutation();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitError(null);

        try {
            const result = await register({
                name: values.name,
                email: values.email,
                password: values.password,
            }).unwrap();

            if (result.success) {
                ToastMessage.notifySuccess('Account created successfully! Please login.');
                router.push('/login?message=Account created successfully');
            } else {
                setSubmitError(result.message || 'Something went wrong');
                ToastMessage.notifyError(result.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Register error:', error);
            const errorMessage = error.data?.message || 'Network error. Please try again.';
            setSubmitError(errorMessage);
            ToastMessage.notifyError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background floating elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-3 rounded-full"></div>
                <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white opacity-5 rounded-full"></div>
                <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-white opacity-3 rounded-full"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                {/* Back to Home Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-start"
                >
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center text-gray-300 hover:text-white text-sm font-medium transition-colors group"
                    >
                        <svg className="w-4 h-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Join CIHS Alumni
                    </h2>
                    <p className="text-gray-400 mb-4">Create your alumni network account</p>
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white font-semibold hover:text-gray-300 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </motion.div>

                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    }}
                    validationSchema={RegisterSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, isValid, values, submitCount }) => {
                        // Check if all required fields are filled
                        const isFormValid = values.name.trim() &&
                            values.email.trim() &&
                            values.password.trim() &&
                            values.confirmPassword.trim() &&
                            isValid;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Form className="space-y-6">
                                    {submitError && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm"
                                        >
                                            {submitError}
                                        </motion.div>
                                    )}

                                    <div className="space-y-4">
                                        <InputComponent1
                                            name="name"
                                            type="text"
                                            label="Full Name"
                                            placeholder="Enter your full name"
                                            required
                                            useFormik={true}
                                            labelClassName="text-gray-300"
                                            backgroundColor="bg-white/10"
                                            borderColor="border-gray-600"
                                            textColor="text-white"
                                            placeholderColor="placeholder-gray-400"
                                            focusBorderColor="focus:border-white/30"
                                            focusRingColor="focus:ring-white/20"
                                            errorClassName="text-red-300"
                                        />

                                        <InputComponent1
                                            name="email"
                                            type="email"
                                            label="Email Address"
                                            placeholder="Enter your email address"
                                            required
                                            useFormik={true}
                                            labelClassName="text-gray-300"
                                            backgroundColor="bg-white/10"
                                            borderColor="border-gray-600"
                                            textColor="text-white"
                                            placeholderColor="placeholder-gray-400"
                                            focusBorderColor="focus:border-white/30"
                                            focusRingColor="focus:ring-white/20"
                                            errorClassName="text-red-300"
                                        />

                                        <PasswordInputComponent1
                                            name="password"
                                            label="Password"
                                            placeholder="Create a strong password"
                                            required
                                            useFormik={true}
                                            labelClassName="text-gray-300"
                                            backgroundColor="bg-white/10"
                                            borderColor="border-gray-600"
                                            textColor="text-white"
                                            placeholderColor="placeholder-gray-400"
                                            focusBorderColor="focus:border-white/30"
                                            focusRingColor="focus:ring-white/20"
                                            iconColor="text-gray-400"
                                            iconHoverColor="hover:text-white"
                                            errorClassName="text-red-300"
                                        />

                                        <PasswordInputComponent1
                                            name="confirmPassword"
                                            label="Confirm Password"
                                            placeholder="Confirm your password"
                                            required
                                            useFormik={true}
                                            labelClassName="text-gray-300"
                                            backgroundColor="bg-white/10"
                                            borderColor="border-gray-600"
                                            textColor="text-white"
                                            placeholderColor="placeholder-gray-400"
                                            focusBorderColor="focus:border-white/30"
                                            focusRingColor="focus:ring-white/20"
                                            iconColor="text-gray-400"
                                            iconHoverColor="hover:text-white"
                                            errorClassName="text-red-300"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                                                Creating Account...
                                            </div>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </motion.button>
                                </Form>
                            </motion.div>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );
}
