"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { setCredentials, selectIsAuthenticated, selectRedirectPath, clearRedirectPath } from '@/redux/features/auth/authSlice';
import { ToastMessage } from '@/utils/ToastMessage';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const redirectPath = useSelector(selectRedirectPath);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            // Check if user just logged out (should go to homepage)
            const justLoggedOut = sessionStorage.getItem('justLoggedOut');

            let targetPath;
            if (justLoggedOut) {
                // If user just logged out, always go to homepage
                targetPath = '/';
                sessionStorage.removeItem('justLoggedOut');
            } else {
                // If user was trying to access a protected route, go there
                // Otherwise go to homepage
                targetPath = redirectPath || '/';
            }

            dispatch(clearRedirectPath());
            router.replace(targetPath);
        }
    }, [isAuthenticated, redirectPath, router, dispatch]);

    // Check for error in URL params
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(errorParam.replace(/_/g, ' '));
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                dispatch(setCredentials({
                    user: result.data.user,
                    token: result.data.token
                }));

                ToastMessage.notifySuccess('Login successful!');
            } else {
                const errorMessage = result.message || 'Login failed';
                setError(errorMessage);
                ToastMessage.notifyError(errorMessage);
            }
        } catch (err) {
            console.error('Login error:', err);
            let errorMessage = 'Network error. Please try again.';

            // Better error handling for different scenarios
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                errorMessage = 'Unable to connect to server. Please check your connection.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            ToastMessage.notifyError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background floating elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-3 rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white opacity-5 rounded-full"></div>
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
                        Welcome Back
                    </h2>
                    <p className="text-gray-400">Sign in to your CIHS Alumni account</p>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Login Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                    onSubmit={handleEmailLogin}
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-sm"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Sign In Button */}
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
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Login */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg bg-white/5 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-sm"
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
                        <span className="text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-white font-semibold hover:text-gray-300 transition-colors">
                                Create Account
                            </Link>
                        </span>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    );
}