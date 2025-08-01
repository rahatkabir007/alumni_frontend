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
    setUser
} from '@/redux/features/auth/authSlice';
import { useLazyGetCurrentUserQuery, useLogoutMutation } from '@/redux/features/auth/authApi';
import { ToastMessage } from '@/utils/ToastMessage';
import Navigation from './Navigation';
import Footer from './Footer';
import FloatingVerificationNotice from './FloatingVerificationNotice';

const AppWrapper = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectToken);
    const [isInitialized, setIsInitialized] = useState(false);

    // Lazy query for fetching user data
    const [triggerGetUser, { isLoading: isFetchingUser }] = useLazyGetCurrentUserQuery();
    const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

    // Pages where Navigation and Footer should be hidden
    const authPages = ['/login', '/register'];
    const shouldShowNavigation = !authPages.includes(pathname);

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/profile'];

    useEffect(() => {
        // Check if user is already logged in on app initialization
        const initializeAuthState = async () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                // First set the token in Redux so API calls work
                dispatch(initializeAuth({ user: null, token: storedToken }));

                try {
                    const { data } = await triggerGetUser()
                    if (data) {
                        dispatch(setUser(data));
                    } else {
                        console.error('Failed to fetch user data');
                        // ToastMessage.notifyError('Failed to fetch user data');
                        // Clear invalid token
                        localStorage.removeItem('token');
                        dispatch(logout());
                    }
                } catch (error) {
                    console.error('Error initializing auth:', error);
                    // Invalid stored data, clear it
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    dispatch(logout());
                }
            }

            // Mark as initialized after checking auth state
            setIsInitialized(true);
        };

        initializeAuthState();
    }, [dispatch, triggerGetUser]);

    // Auto-fetch user data when authenticated but user data is missing
    useEffect(() => {
        if (isAuthenticated && token && !user && !isFetchingUser && isInitialized) {
            triggerGetUser().catch(error => {
                // Don't logout on API errors in AppWrapper, just log them
                console.warn('Failed to fetch user data in AppWrapper:', error);
            });
        }
    }, [isAuthenticated, token, user, triggerGetUser, isFetchingUser, isInitialized]);

    const handleLogout = async () => {
        try {
            // Set flag to indicate this is a logout action
            sessionStorage.setItem('justLoggedOut', 'true');

            // Call logout API to invalidate token on server
            try {
                const token = localStorage.getItem('token');
                await logoutMutation(token).unwrap();
            } catch (apiError) {
                // Even if API call fails, continue with local logout
                console.warn('Logout API call failed, continuing with local logout:', apiError);
            }

            // Clear all possible localStorage items
            const keysToRemove = ['token', 'user', 'refreshToken', 'authData'];
            keysToRemove.forEach(key => localStorage.removeItem(key));

            // Clear all sessionStorage except the justLoggedOut flag
            const justLoggedOut = sessionStorage.getItem('justLoggedOut');
            sessionStorage.clear();
            sessionStorage.setItem('justLoggedOut', justLoggedOut);

            // Dispatch logout action to clear Redux state
            dispatch(logout());

            // Show success message
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

        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, clear local state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch(logout());
            ToastMessage.notifyError('Logout completed with errors');

            // Still redirect if on protected route
            const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
            if (isProtectedRoute) {
                router.push('/');
            } else {
                router.refresh();
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {shouldShowNavigation && (
                <Navigation
                    user={user}
                    onLogout={handleLogout}
                    isInitialized={isInitialized}
                    isLoggingOut={isLoggingOut}
                />
            )}

            <main className="flex-grow min-h-[50vh]">
                {children}
            </main>

            {shouldShowNavigation && <Footer />}

            {/* Only show FloatingVerificationNotice if conditions are met */}
            <FloatingVerificationNotice />
        </div>
    );
};

export default AppWrapper;