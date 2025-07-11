"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, setRedirectPath, initializeAuth } from '@/redux/features/auth/authSlice';
import { ToastMessage } from '@/utils/ToastMessage';
import FullScreenLoader from './shared/Loader/FullScreenLoader';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            // Check for stored authentication data
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    const user = JSON.parse(userData);
                    dispatch(initializeAuth({ user, token }));
                    setIsLoading(false);
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Store the current path for redirect after login
            dispatch(setRedirectPath(pathname));

            // Show toast message
            ToastMessage.notifyError('Please login first to access this page');

            // Redirect to login
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, pathname, dispatch, router]);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isAuthenticated) {
        return <FullScreenLoader />;
    }

    return children;
};

export default ProtectedRoute;
