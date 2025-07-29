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
                const parsedUser = user ? JSON.parse(user) : null;

                // console.log('Auth callback - token:', !!token);
                // console.log('Auth callback - user param:', userParam);
                // console.log('Auth callback - error:', authError);

                if (authError) {
                    setError(`Authentication failed: ${authError.replace(/_/g, ' ')}`);
                    ToastMessage.notifyError(`Authentication failed: ${authError.replace(/_/g, ' ')}`);
                    setLoading(false);
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                    return;
                }

                if (!token) {
                    setError('Missing authentication token');
                    ToastMessage.notifyError('Missing authentication token');
                    setLoading(false);
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                    return;
                }

                // console.log('Auth callback - Token received, storing and fetching user data...');

                // Store token first so API calls work
                localStorage.setItem('token', token);

                if (!parsedUser?.isProfileCompleted) {
                    router.push(`/auth/required_info?token=${token}&user=${user}`);
                    return;
                }

                setTimeout(async () => {
                    try {
                        // console.log('Auth callback - Fetching complete user data from /auth/me...');
                        const userData = await triggerGetUser().unwrap();
                        // console.log('Auth callback - Complete user data fetched successfully:', userData);

                        // Validate that we received a proper user object
                        if (!userData || !userData.email || !userData.id) {
                            throw new Error('Invalid user data received from server');
                        }



                        // Set credentials with complete user data and token
                        dispatch(setCredentials({
                            user: userData, // This is the complete user object from /auth/me
                            token: token
                        }));

                        ToastMessage.notifySuccess('Login successful! Welcome back!');

                        // Give a moment for the state to update before redirecting
                        setTimeout(() => {
                            router.replace('/');
                        }, 500);

                    } catch (fetchError) {
                        console.error('Auth callback - Failed to fetch user data:', fetchError);

                        // Clean up token if user fetch fails
                        localStorage.removeItem('token');

                        const errorMsg = fetchError.status === 401 ?
                            'Session expired. Please try logging in again.' :
                            fetchError.message || 'Failed to load user profile. Please try again.';

                        setError(errorMsg);
                        ToastMessage.notifyError(errorMsg);
                        setLoading(false);

                        setTimeout(() => {
                            router.push('/login');
                        }, 3000);
                    }
                }, 1000);
            } catch (err) {
                console.error('Auth callback error:', err);
                setError('Failed to process authentication');
                ToastMessage.notifyError('Failed to process authentication');
                setLoading(false);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        };

        handleCallback();
    }, [router, searchParams, dispatch, triggerGetUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg font-medium">Processing authentication...</p>
                    <p className="text-gray-400 text-sm mt-2">Please wait while we log you in</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-white mb-2">Authentication Error</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4">
                        <p className="text-sm">Redirecting to login page in a few seconds...</p>
                    </div>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        Go to Login Now
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
