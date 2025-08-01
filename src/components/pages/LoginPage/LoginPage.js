"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useLoginMutation, useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi';
import { setCredentials, selectIsAuthenticated, selectRedirectPath, clearRedirectPath } from '@/redux/features/auth/authSlice';
import InputComponent1 from '@/components/common/InputComponent1';
import PasswordInputComponent1 from '@/components/common/PasswordInputComponent1';
import { handleApiError, handleApiSuccess } from '@/utils/errorHandler';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(1, 'Password is required')
        .required('Password is required')
});

// Alumni SVG Component for Login
const AlumniLoginSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full text-blue-600">
        <defs>
            <linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
        </defs>

        {/* Welcome back concept with building and person */}
        <rect x="80" y="140" width="240" height="100" fill="url(#loginGrad)" rx="8" />

        {/* Windows */}
        <rect x="100" y="160" width="20" height="25" fill="#E5E7EB" />
        <rect x="130" y="160" width="20" height="25" fill="#E5E7EB" />
        <rect x="160" y="160" width="20" height="25" fill="#E5E7EB" />
        <rect x="190" y="160" width="20" height="25" fill="#E5E7EB" />
        <rect x="220" y="160" width="20" height="25" fill="#E5E7EB" />
        <rect x="250" y="160" width="20" height="25" fill="#E5E7EB" />
        <rect x="280" y="160" width="20" height="25" fill="#E5E7EB" />

        {/* Door */}
        <rect x="185" y="190" width="30" height="50" fill="#374151" rx="4" />
        <circle cx="205" cy="215" r="2" fill="#9CA3AF" />

        {/* Roof */}
        <polygon points="60,140 200,100 340,140" fill="#1F2937" />

        {/* Chimney */}
        <rect x="280" y="110" width="15" height="30" fill="#6B7280" />

        {/* Welcome person */}
        <circle cx="200" cy="120" r="12" fill="#FDE68A" />
        <rect x="190" y="132" width="20" height="30" fill="#059669" />
        <rect x="195" y="138" width="10" height="2" fill="#1F2937" />
        <rect x="195" y="142" width="10" height="2" fill="#1F2937" />
        <rect x="195" y="146" width="10" height="2" fill="#1F2937" />

        {/* Welcome sign */}
        <rect x="50" y="80" width="80" height="25" fill="#F3F4F6" stroke="#D1D5DB" rx="4" />
        <text x="90" y="95" textAnchor="middle" className="text-xs fill-gray-700" fontSize="8">WELCOME</text>

        {/* Graduation cap floating */}
        <path d="M320 60 L340 55 L370 65 L350 70 Z" fill="#1F2937" />
        <rect x="345" y="50" width="5" height="15" fill="#374151" />
        <polygon points="350,45 355,50 345,50" fill="#EF4444" />
    </svg>
);

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [login, { isLoading }] = useLoginMutation();
    const [triggerGetUser] = useLazyGetCurrentUserQuery();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const redirectPath = useSelector(selectRedirectPath);

    useEffect(() => {
        if (isAuthenticated) {
            const justLoggedOut = sessionStorage.getItem('justLoggedOut');
            let targetPath;

            if (justLoggedOut) {
                targetPath = '/';
                sessionStorage.removeItem('justLoggedOut');
            } else {
                targetPath = redirectPath || '/';
            }

            dispatch(clearRedirectPath());
            router.replace(targetPath);
        }
    }, [isAuthenticated, redirectPath, router, dispatch]);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(errorParam.replace(/_/g, ' '));
        }
    }, [searchParams]);

    const handleEmailLogin = async (values, { setSubmitting }) => {
        setError('');

        try {
            const response = await login(values).unwrap();

            if (response.success) {
                const { token, user } = response.data;

                localStorage.setItem('token', token);
                dispatch(setCredentials({ user: user, token: token }));
                setIsProcessing(true);

                setTimeout(async () => {
                    try {
                        const { data: userData } = await triggerGetUser();
                        if (userData) {
                            dispatch(setCredentials({ user: userData, token: token }));
                        }

                        handleApiSuccess(response, 'Login successful!');
                        const justLoggedOut = sessionStorage.getItem('justLoggedOut');
                        let targetPath = justLoggedOut ? '/' : (redirectPath || '/');

                        if (justLoggedOut) {
                            sessionStorage.removeItem('justLoggedOut');
                        }

                        dispatch(clearRedirectPath());
                        router.replace(targetPath);

                    } catch (userFetchError) {
                        console.warn('Could not fetch fresh user data, using login response data');
                        handleApiSuccess(response, 'Login successful!');
                        const justLoggedOut = sessionStorage.getItem('justLoggedOut');
                        let targetPath = justLoggedOut ? '/' : (redirectPath || '/');

                        if (justLoggedOut) {
                            sessionStorage.removeItem('justLoggedOut');
                        }

                        dispatch(clearRedirectPath());
                        router.replace(targetPath);
                    }
                }, 1000);

            } else {
                const errorMessage = response.message || response.error || 'Login failed';
                handleApiError({ data: { message: errorMessage } }, setError);
            }

        } catch (err) {
            handleApiError(err, setError, true, 'Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        const frontendCallback = encodeURIComponent(`${window.location.origin}/auth/callback`);
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?callback=${frontendCallback}`;
    };

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 text-lg font-medium">Processing authentication...</p>
                    <p className="text-gray-500 text-sm mt-2">Please wait while we log you in</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
            {/* Left Side - SVG */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
                <div className="max-w-md w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <AlumniLoginSVG />
                        <div className="text-center mt-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Welcome Back!
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Sign in to access your alumni dashboard and connect with the CIHS community.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Sign In
                        </h2>
                        <p className="text-gray-600">Access your CIHS Alumni account</p>
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={LoginSchema}
                            onSubmit={handleEmailLogin}
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
                                            focusBorderColor="focus:border-blue-500"
                                            focusRingColor="focus:ring-blue-500/20"
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
                                            focusBorderColor="focus:border-blue-500"
                                            focusRingColor="focus:ring-blue-500/20"
                                            iconColor="text-gray-400"
                                            iconHoverColor="hover:text-gray-600"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading || isSubmitting}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                                        onClick={handleGoogleLogin}
                                        className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                                            <Link href="/register" className="text-blue-600 font-semibold hover:text-blue-500 transition-colors">
                                                Create Account
                                            </Link>
                                        </span>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </motion.div>

                    {/* Back to Home */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center"
                    >
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors mx-auto"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}