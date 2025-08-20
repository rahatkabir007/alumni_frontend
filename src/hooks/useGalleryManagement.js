import { useSelector, useDispatch } from 'react-redux';
import {
    selectGalleryManagement,
    setGalleryManagementTab,
    setGalleryManagementPage,
    setGalleryYearFilter,
    setSelectedImage,
    addProcessingId,
    removeProcessingId
} from '@/redux/features/profile/profileSlice';

export const useGalleryManagement = () => {
    const dispatch = useDispatch();

    // Gallery management selectors with fallback values
    const galleryManagement = useSelector((state) => {
        try {
            return selectGalleryManagement(state) || {
                activeTab: 'pending_approval',
                currentPage: 1,
                yearFilter: '',
                selectedImage: null,
                processingIds: []
            };
        } catch (error) {
            console.warn('Gallery management state not found, using fallback');
            return {
                activeTab: 'pending_approval',
                currentPage: 1,
                yearFilter: '',
                selectedImage: null,
                processingIds: []
            };
        }
    });

    const handleTabChange = (tabId) => {
        try {
            dispatch(setGalleryManagementTab(tabId));
        } catch (error) {
            console.error('Failed to change gallery management tab:', error);
        }
    };

    const handlePageChange = (page) => {
        try {
            dispatch(setGalleryManagementPage(page));
        } catch (error) {
            console.error('Failed to change gallery management page:', error);
        }
    };

    const handleYearChange = (year) => {
        try {
            dispatch(setGalleryYearFilter(year));
        } catch (error) {
            console.error('Failed to change year filter:', error);
        }
    };

    const handleImageClick = (image) => {
        try {
            dispatch(setSelectedImage(image));
        } catch (error) {
            console.error('Failed to select image:', error);
        }
    };

    const closeImageModal = () => {
        try {
            dispatch(setSelectedImage(null));
        } catch (error) {
            console.error('Failed to close image modal:', error);
        }
    };

    const startProcessing = (id) => {
        try {
            dispatch(addProcessingId(id));
        } catch (error) {
            console.error('Failed to add processing ID:', error);
        }
    };

    const stopProcessing = (id) => {
        try {
            dispatch(removeProcessingId(id));
        } catch (error) {
            console.error('Failed to remove processing ID:', error);
        }
    };

    const isProcessing = (id) => {
        try {
            return galleryManagement.processingIds.includes(id);
        } catch (error) {
            return false;
        }
    };

    return {
        // State
        ...galleryManagement,
        processingIds: new Set(galleryManagement.processingIds || []), // Convert to Set for easier checking

        // Actions
        handleTabChange,
        handlePageChange,
        handleYearChange,
        handleImageClick,
        closeImageModal,
        startProcessing,
        stopProcessing,
        isProcessing
    };
};

