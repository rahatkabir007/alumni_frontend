"use client"
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/features/auth/authSlice';
import { ToastMessage } from '@/utils/ToastMessage';

export default function AuthCallback() {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const token = searchParams.get('token');
                const user = searchParams.get('user');
                const authError = searchParams.get('error');

                if (authError) {
                    setError(`Authentication failed: ${authError}`);
                    setLoading(false);
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        router.push('/');
                    }, 3000);
                    return;
                }

                if (token && user) {
                    // Parse user data
                    const userData = JSON.parse(decodeURIComponent(user));

                    // Store token in localStorage and update Redux state
                    dispatch(setCredentials({
                        user: userData,
                        token: token
                    }));

                    console.log('Auth successful:', userData);

                    ToastMessage.notifySuccess('Login successful!');

                    // Redirect to homepage instead of dashboard
                    router.push('/');
                } else {
                    setError('Missing authentication data');
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
    }, [router, searchParams, dispatch]);

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
