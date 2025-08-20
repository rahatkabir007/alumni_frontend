import { useSelector, useDispatch } from 'react-redux';
import {
    selectUserManagement,
    setUserManagementTab,
    setUserManagementPage,
    setUserManagementSearch,
    setConfirmModal,
    setUserDetailsModal
} from '@/redux/features/profile/profileSlice';

export const useUserManagement = () => {
    const dispatch = useDispatch();

    // User management selectors with fallback values
    const userManagement = useSelector((state) => {
        try {
            return selectUserManagement(state) || {
                activeTab: 'all-users',
                currentPage: 1,
                searchTerm: '',
                confirmModal: {
                    open: false,
                    type: '',
                    user: null,
                    loading: false
                },
                userDetailsModal: {
                    isOpen: false,
                    userId: null
                }
            };
        } catch (error) {
            console.warn('User management state not found, using fallback');
            return {
                activeTab: 'all-users',
                currentPage: 1,
                searchTerm: '',
                confirmModal: {
                    open: false,
                    type: '',
                    user: null,
                    loading: false
                },
                userDetailsModal: {
                    isOpen: false,
                    userId: null
                }
            };
        }
    });

    const handleTabChange = (tabId) => {
        try {
            dispatch(setUserManagementTab(tabId));
        } catch (error) {
            console.error('Failed to change user management tab:', error);
        }
    };

    const handlePageChange = (page) => {
        try {
            dispatch(setUserManagementPage(page));
        } catch (error) {
            console.error('Failed to change user management page:', error);
        }
    };

    const handleSearchChange = (searchTerm) => {
        try {
            dispatch(setUserManagementSearch(searchTerm));
        } catch (error) {
            console.error('Failed to update search term:', error);
        }
    };

    const openConfirmModal = (type, user) => {
        try {
            dispatch(setConfirmModal({
                open: true,
                type,
                user,
                loading: false
            }));
        } catch (error) {
            console.error('Failed to open confirm modal:', error);
        }
    };

    const closeConfirmModal = () => {
        try {
            dispatch(setConfirmModal({
                open: false,
                type: '',
                user: null,
                loading: false
            }));
        } catch (error) {
            console.error('Failed to close confirm modal:', error);
        }
    };

    const setConfirmModalLoading = (loading) => {
        try {
            dispatch(setConfirmModal({
                ...userManagement.confirmModal,
                loading
            }));
        } catch (error) {
            console.error('Failed to set confirm modal loading:', error);
        }
    };

    const openUserDetailsModal = (userId) => {
        try {
            dispatch(setUserDetailsModal({
                isOpen: true,
                userId
            }));
        } catch (error) {
            console.error('Failed to open user details modal:', error);
        }
    };

    const closeUserDetailsModal = () => {
        try {
            dispatch(setUserDetailsModal({
                isOpen: false,
                userId: null
            }));
        } catch (error) {
            console.error('Failed to close user details modal:', error);
        }
    };

    return {
        // State
        ...userManagement,

        // Actions
        handleTabChange,
        handlePageChange,
        handleSearchChange,
        openConfirmModal,
        closeConfirmModal,
        setConfirmModalLoading,
        openUserDetailsModal,
        closeUserDetailsModal
    };
};
