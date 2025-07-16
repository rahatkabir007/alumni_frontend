"use client"
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectToken,
    initializeAuth,
    logout,
    setCredentials
} from '@/redux/features/auth/authSlice';
import { useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi';
import { ToastMessage } from '@/utils/ToastMessage';
import Navigation from './Navigation';
import Footer from './Footer';

const AppWrapper = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectToken);
    const [isInitialized, setIsInitialized] = useState(false);

    // Lazy query for fetching user data
    const [triggerGetUser] = useLazyGetCurrentUserQuery();

    // Pages where Navigation and Footer should be hidden
    const authPages = ['/login', '/register'];
    const shouldShowNavigation = !authPages.includes(pathname);

    // Define protected routes
    const protectedRoutes = ['/profile'];

    useEffect(() => {
        // Check if user is already logged in on app initialization
        const initializeAuthState = async () => {
            try {
                const storedToken = localStorage.getItem('token');

                console.log('AppWrapper - Initializing auth state...');
                console.log('AppWrapper - Stored token:', !!storedToken);

                if (storedToken) {
                    // If token exists, always fetch fresh user data from API
                    try {
                        console.log('AppWrapper - Token found, fetching user data from API...');
                        const userData = await triggerGetUser().unwrap();
                        console.log('AppWrapper - User data fetched successfully:', userData);

                        // Set credentials with fresh user data and stored token
                        dispatch(setCredentials({
                            user: userData,
                            token: storedToken
                        }));
                    } catch (error) {
                        console.error('AppWrapper - Failed to fetch user data:', error);
                        if (error.status === 401 || error.status === 403) {
                            console.log('AppWrapper - Token invalid, clearing storage...');
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            dispatch(logout());
                        } else {
                            console.warn('AppWrapper - Network error, keeping token for retry...');
                            // For network errors, don't clear the token immediately
                            // Just log the error and let the user try again
                        }
                    }
                } else {
                    console.log('AppWrapper - No stored token, clearing any invalid state...');
                    // Clear any invalid state
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    dispatch(logout());
                }
            } catch (error) {
                console.error('AppWrapper - Error initializing auth:', error);
                // Invalid stored data, clear it
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                dispatch(logout());
            }

            setIsInitialized(true);
        };

        initializeAuthState();
    }, [dispatch, triggerGetUser]);

    const handleLogout = () => {
        // Set flag to indicate this is a logout action
        sessionStorage.setItem('justLoggedOut', 'true');

        // Clear all storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        dispatch(logout());
        ToastMessage.notifySuccess('Logged out successfully');

        // Check if current route is protected
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

        if (isProtectedRoute) {
            // If on a protected route, redirect to homepage
            router.push('/');
        } else {
            // If on a non-protected route, stay on the same route
            router.refresh(); // Refresh to update the UI state
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {shouldShowNavigation && (
                <Navigation
                    user={user}
                    onLogout={handleLogout}
                    isInitialized={isInitialized}
                />
            )}

            <main className="flex-grow">
                {children}
            </main>

            {shouldShowNavigation && <Footer />}
        </div>
    );
};

export default AppWrapper;

