"use client"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice';
import { ToastMessage } from '@/utils/ToastMessage';

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                ToastMessage.notifySuccess('Account created successfully! Please login.');
                router.push('/login?message=Account created successfully');
            } else {
                const errorMessage = result.message || 'Something went wrong';
                setSubmitError(errorMessage);
                ToastMessage.notifyError(errorMessage);
            }
        } catch (error) {
            console.error('Register error:', error);
            let errorMessage = 'Network error. Please try again.';

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'Unable to connect to server. Please check your connection.';
            } else if (error.message) {
                errorMessage = error.message;
            }

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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full space-y-8 relative z-10"
            >
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
                    {({ isSubmitting }) => (
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
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <Field
                                            id="name"
                                            name="name"
                                            type="text"
                                            className="w-full px-4 py-3 bg-white/10 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm"
                                            placeholder="Enter your full name"
                                        />
                                        <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-300" />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <Field
                                            id="email"
                                            name="email"
                                            type="email"
                                            className="w-full px-4 py-3 bg-white/10 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm"
                                            placeholder="Enter your email address"
                                        />
                                        <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-300" />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <Field
                                            id="password"
                                            name="password"
                                            type="password"
                                            className="w-full px-4 py-3 bg-white/10 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm"
                                            placeholder="Create a strong password"
                                        />
                                        <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-300" />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                            Confirm Password
                                        </label>
                                        <Field
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            className="w-full px-4 py-3 bg-white/10 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm"
                                            placeholder="Confirm your password"
                                        />
                                        <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-300" />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform"
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

                                <div className="text-center">
                                    <p className="text-xs text-gray-500">
                                        By creating an account, you agree to our{' '}
                                        <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                                            Privacy Policy
                                        </Link>
                                    </p>
                                </div>
                            </Form>
                        </motion.div>
                    )}
                </Formik>
            </motion.div>
        </div>
    );
}
