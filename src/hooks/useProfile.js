import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCredentials } from '@/redux/features/auth/authSlice';
import { selectCurrentUser, selectIsAuthenticated, selectToken } from '@/redux/features/auth/authSlice';
import {
    setActiveSection,
    setIsRefreshing,
    setHasTriedFetch,
    setProfileCache,
    selectActiveSection,
    selectIsRefreshing,
    selectHasTriedFetch,
    selectProfileCache
} from '@/redux/features/profile/profileSlice';
import { useEffect } from 'react';
import { useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi';

export const useProfile = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    // Auth selectors
    const currentUser = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectToken);

    // Profile selectors with fallback values
    const activeSection = useSelector((state) => {
        try {
            return selectActiveSection(state) || 'basic-info';
        } catch (error) {
            console.warn('Profile state not found, using fallback');
            return 'basic-info';
        }
    });

    const isRefreshing = useSelector((state) => {
        try {
            return selectIsRefreshing(state) || false;
        } catch (error) {
            return false;
        }
    });

    const hasTriedFetch = useSelector((state) => {
        try {
            return selectHasTriedFetch(state) || false;
        } catch (error) {
            return false;
        }
    });

    const profileCache = useSelector((state) => {
        try {
            return selectProfileCache(state) || null;
        } catch (error) {
            return null;
        }
    });

    const [triggerGetUser, { isLoading: isUserLoading }] = useLazyGetCurrentUserQuery();

    // Authentication check
    useEffect(() => {
        if (!isAuthenticated && !token) {
            console.log('Not authenticated and no token, redirecting to login...');
            router.push('/login');
            return;
        }
    }, [isAuthenticated, token, router]);

    // Auto-fetch user data if needed
    useEffect(() => {
        const fetchUserDataIfNeeded = async () => {
            const storedToken = token || localStorage.getItem('token');

            if (storedToken && !currentUser && !hasTriedFetch && !isUserLoading) {
                console.log('Profile Hook - Have token but no user data, fetching...');
                dispatch(setHasTriedFetch(true));

                try {
                    console.log('Profile Hook - Fetching user data...');
                    const result = await triggerGetUser().unwrap();
                    console.log('Profile Hook - User data fetched successfully:', result);

                    dispatch(setCredentials({
                        user: result,
                        token: storedToken
                    }));

                    dispatch(setProfileCache(result));

                } catch (error) {
                    console.error('Profile Hook - Failed to fetch user data:', error);

                    if (error.status === 401 || error.status === 403) {
                        dispatch(setCredentials({ user: null, token: null }));
                        localStorage.removeItem('token');
                        router.push('/login');
                    }
                }
            }
        };

        fetchUserDataIfNeeded();
    }, [currentUser, token, hasTriedFetch, isUserLoading, triggerGetUser, dispatch, router]);

    // Profile actions with error handling
    const handleSectionChange = (section) => {
        try {
            dispatch(setActiveSection(section));
        } catch (error) {
            console.error('Failed to update active section:', error);
        }
    };

    const handleRefreshData = async () => {
        try {
            dispatch(setIsRefreshing(true));
            const result = await triggerGetUser().unwrap();

            const storedToken = token || localStorage.getItem('token');
            dispatch(setCredentials({
                user: result,
                token: storedToken
            }));

            dispatch(setProfileCache(result));

        } catch (error) {
            console.error('Failed to refresh user data:', error);
        } finally {
            dispatch(setIsRefreshing(false));
        }
    };

    const handleUserUpdate = (updatedData) => {
        try {
            if (updatedData) {
                const storedToken = token || localStorage.getItem('token');
                dispatch(setCredentials({
                    user: updatedData,
                    token: storedToken
                }));

                dispatch(setProfileCache(updatedData));
            }
        } catch (error) {
            console.error('Failed to update user data:', error);
        }
    };

    return {
        // State
        currentUser,
        isAuthenticated,
        activeSection,
        isRefreshing,
        hasTriedFetch,
        profileCache,
        isUserLoading,

        // Actions
        handleSectionChange,
        handleRefreshData,
        handleUserUpdate,

        // Dispatch for custom actions
        dispatch
    };
};

