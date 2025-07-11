"use client"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Replace this with your actual API call
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                }),
            });

            if (response.ok) {
                // Redirect to login or dashboard
                router.push('/');
            } else {
                const errorData = await response.json();
                setSubmitError(errorData.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Register error:', error);
            setSubmitError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

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
                        <Form className="mt-8 space-y-6">
                            {submitError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                    {submitError}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <Field
                                        id="name"
                                        name="name"
                                        type="text"
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="Enter your full name"
                                    />
                                    <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="Enter your email address"
                                    />
                                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="Enter your password"
                                    />
                                    <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirm your password"
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    By signing up, you agree to our{' '}
                                    <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
