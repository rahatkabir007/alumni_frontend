"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectToken, selectCurrentUser, setRedirectPath } from '@/redux/features/auth/authSlice';
import { ToastMessage } from '@/utils/ToastMessage';
import FullScreenLoader from './Loader/FullScreenLoader';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectToken);
    const user = useSelector(selectCurrentUser);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            // Just check the Redux state - let AppWrapper handle initialization
            const storedToken = localStorage.getItem('token');

            // If there's a stored token but no token in Redux, we need to wait for AppWrapper to initialize
            if (storedToken && !token) {
                // AppWrapper is still initializing, wait a bit more
                setTimeout(() => {
                    setIsLoading(false);
                    setHasCheckedAuth(true);
                }, 500);
                return;
            }

            setIsLoading(false);
            setHasCheckedAuth(true);
        };

        checkAuth();
    }, [token]);

    useEffect(() => {
        if (hasCheckedAuth && !isLoading && !isAuthenticated) {
            // Only redirect if user is not authenticated and not from logout
            const isFromLogout = sessionStorage.getItem('justLoggedOut');

            if (!isFromLogout) {
                dispatch(setRedirectPath(pathname));
                ToastMessage.notifyError('Please login first to access this page');
                router.push("/login");
            }

            sessionStorage.removeItem('justLoggedOut');
        }
    }, [isAuthenticated, isLoading, hasCheckedAuth, pathname, dispatch, router]);

    if (isLoading || !hasCheckedAuth) {
        return <FullScreenLoader />;
    }

    if (!isAuthenticated) {
        return <FullScreenLoader />;
    }

    return children;
};

export default ProtectedRoute;