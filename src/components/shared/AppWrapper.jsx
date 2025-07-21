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
    const [triggerGetUser, { data: userData, isLoading: isFetchingUser }] = useLazyGetCurrentUserQuery();

    // Pages where Navigation and Footer should be hidden
    const authPages = ['/login', '/register'];
    const shouldShowNavigation = !authPages.includes(pathname);

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/profile'];



    const handleLogout = () => {
        // Set flag to indicate this is a logout action
        sessionStorage.setItem('justLoggedOut', 'true');

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
                    user={userData || user}
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
