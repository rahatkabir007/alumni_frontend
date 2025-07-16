"use client"
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/features/auth/authSlice';
import { useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi';
import { ToastMessage } from '@/utils/ToastMessage';

function AuthCallbackContent() {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [triggerGetUser] = useLazyGetCurrentUserQuery();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const token = searchParams.get('token');
                const user = searchParams.get('user');
                const authError = searchParams.get('error');

                console.log('Auth callback - token:', !!token);
                console.log('Auth callback - user param:', user);

                if (authError) {
                    setError(`Authentication failed: ${authError}`);
                    setLoading(false);
                    setTimeout(() => {
                        router.push('/');
                    }, 3000);
                    return;
                }

                if (token) {
                    console.log('Auth callback - Token received, storing and fetching user data...');

                    // Store token temporarily
                    localStorage.setItem('token', token);

                    // Always fetch fresh user data from /auth/me for Google login
                    try {
                        console.log('Auth callback - Fetching user data from /auth/me...');
                        const userData = await triggerGetUser().unwrap();
                        console.log('Auth callback - User data fetched successfully:', userData);

                        // Set credentials with complete user data
                        dispatch(setCredentials({
                            user: userData,
                            token: token
                        }));

                        ToastMessage.notifySuccess('Login successful!');
                        router.push('/');
                    } catch (fetchError) {
                        console.error('Auth callback - Failed to fetch user data:', fetchError);
                        localStorage.removeItem('token');
                        setError('Failed to load user profile after authentication');
                        setLoading(false);
                        setTimeout(() => {
                            router.push('/login');
                        }, 3000);
                    }
                } else {
                    setError('Missing authentication token');
                    setLoading(false);
                    setTimeout(() => {
                        router.push('/');
                    }, 3000);
                }
            } catch (err) {
                console.error('Auth callback error:', err);
                setError('Failed to process authentication');
                setLoading(false);
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            }
        };

        handleCallback();
    }, [router, searchParams, dispatch, triggerGetUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Processing authentication...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">Redirecting to homepage...</p>
                </div>
            </div>
        );
    }

    return null;
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
