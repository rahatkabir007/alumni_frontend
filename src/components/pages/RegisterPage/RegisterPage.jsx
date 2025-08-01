"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice';
import { handleApiError, handleApiSuccess } from '@/utils/errorHandler';
import RegistrationStep1 from './components/RegistrationStep1';
import RegistrationStep2 from './components/RegistrationStep2';

// Alumni SVG Component
const AlumniSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full text-blue-600">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
        </defs>

        {/* Building */}
        <rect x="100" y="120" width="200" height="120" fill="url(#grad1)" rx="8" />
        <rect x="120" y="140" width="30" height="40" fill="#E5E7EB" />
        <rect x="170" y="140" width="30" height="40" fill="#E5E7EB" />
        <rect x="220" y="140" width="30" height="40" fill="#E5E7EB" />
        <rect x="270" y="140" width="30" height="40" fill="#E5E7EB" />

        {/* Roof */}
        <polygon points="80,120 200,80 320,120" fill="#1F2937" />

        {/* Flag */}
        <rect x="195" y="60" width="10" height="40" fill="#374151" />
        <polygon points="205,65 205,85 240,75" fill="#EF4444" />

        {/* People/Graduates */}
        <circle cx="150" cy="200" r="8" fill="#FDE68A" />
        <rect x="145" y="208" width="10" height="20" fill="#3B82F6" />
        <polygon points="140,208 160,208 150,200" fill="#1F2937" />

        <circle cx="200" cy="200" r="8" fill="#FDE68A" />
        <rect x="195" y="208" width="10" height="20" fill="#3B82F6" />
        <polygon points="190,208 210,208 200,200" fill="#1F2937" />

        <circle cx="250" cy="200" r="8" fill="#FDE68A" />
        <rect x="245" y="208" width="10" height="20" fill="#3B82F6" />
        <polygon points="240,208 260,208 250,200" fill="#1F2937" />

        {/* Books */}
        <rect x="50" y="220" width="8" height="15" fill="#EF4444" transform="rotate(-10 54 227)" />
        <rect x="60" y="218" width="8" height="15" fill="#10B981" transform="rotate(-5 64 225)" />
        <rect x="70" y="220" width="8" height="15" fill="#F59E0B" transform="rotate(5 74 227)" />
    </svg>
);

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [submitError, setSubmitError] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});

    const [register, { isLoading }] = useRegisterMutation();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleStep1Submit = (values) => {
        setFormData(values);
        setCurrentStep(2);
    };

    const handleStep2Submit = async (values, { setSubmitting }) => {
        setSubmitError(null);

        try {
            const finalData = {
                ...formData,
                password: values.password,
            };

            const result = await register(finalData).unwrap();

            if (result.success) {
                handleApiSuccess(result, 'Account created successfully! Please login.');
                router.push('/login?message=Account created successfully');
            } else {
                handleApiError(
                    { data: { message: result.message || 'Something went wrong' } },
                    setSubmitError
                );
            }
        } catch (error) {
            handleApiError(error, setSubmitError, true, 'Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const goBackToStep1 = () => {
        setCurrentStep(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - SVG */}
                    <div className="flex items-center justify-center">
                        <div className="max-w-md w-full">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <AlumniSVG />
                                <div className="text-center mt-8">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                        Join Our Alumni Network
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Connect with fellow graduates, share experiences, and build lasting relationships
                                        with the CIHS community.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="flex items-center justify-center">
                        <div className="max-w-lg w-full space-y-8">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-center"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Create Account
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Step {currentStep} of 2 - {currentStep === 1 ? 'Basic Information' : 'Security Setup'}
                                </p>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                                    <div
                                        className="bg-black h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(currentStep / 2) * 100}%` }}
                                    ></div>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-black font-semibold hover:text-gray-700 transition-colors">
                                        Sign in here
                                    </Link>
                                </p>
                            </motion.div>

                            {/* Step Components */}
                            {currentStep === 1 && (
                                <RegistrationStep1
                                    formData={formData}
                                    onNext={handleStep1Submit}
                                />
                            )}

                            {currentStep === 2 && (
                                <RegistrationStep2
                                    onSubmit={handleStep2Submit}
                                    onBack={goBackToStep1}
                                    isLoading={isLoading}
                                    submitError={submitError}
                                />
                            )}

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
            </div>
        </div>
    );
}