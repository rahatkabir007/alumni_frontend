import { ToastMessage } from './ToastMessage';

/**
 * Handles API errors and extracts meaningful error messages
 * @param {Object} error - The error object from API call
 * @param {Function} setError - Optional function to set form error state
 * @param {boolean} showToast - Whether to show toast notification (default: true)
 * @param {string} fallbackMessage - Custom fallback message
 * @returns {string} - The extracted error message
 */
export const handleApiError = (error, setError = null, showToast = true, fallbackMessage = 'Something went wrong. Please try again.') => {
    console.error('API Error:', error);

    let errorMessage = fallbackMessage;

    // Handle different error structures
    if (error?.data) {
        // RTK Query error with response data
        if (error.data.message) {
            errorMessage = error.data.message;
        } else if (error.data.error) {
            errorMessage = error.data.error;
        } else if (Array.isArray(error.data.errors)) {
            // Handle validation errors array
            errorMessage = error.data.errors.join(', ');
        } else if (error.data.details) {
            errorMessage = error.data.details;
        }
    } else if (error?.message) {
        // Network or other errors
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        // String error
        errorMessage = error;
    }

    // Set form error if function provided
    if (setError) {
        setError(errorMessage);
    }

    // Show toast notification if enabled
    if (showToast) {
        ToastMessage.notifyError(errorMessage);
    }

    return errorMessage;
};

/**
 * Handles successful API responses
 * @param {Object} response - The success response
 * @param {string} successMessage - Success message to show
 * @param {boolean} showToast - Whether to show toast notification (default: true)
 */
export const handleApiSuccess = (response, successMessage, showToast = true) => {
    if (showToast) {
        ToastMessage.notifySuccess(successMessage);
    }
    console.log('API Success:', response);
};

/**
 * Wrapper for handling async operations with consistent error handling
 * @param {Function} asyncOperation - The async function to execute
 * @param {Object} options - Configuration options
 * @returns {Object} - { success: boolean, data?: any, error?: string }
 */
export const handleAsyncOperation = async (asyncOperation, options = {}) => {
    const {
        setError = null,
        showToast = true,
        successMessage = null,
        fallbackMessage = 'Something went wrong. Please try again.'
    } = options;

    try {
        const result = await asyncOperation();

        if (successMessage) {
            handleApiSuccess(result, successMessage, showToast);
        }

        return { success: true, data: result };
    } catch (error) {
        const errorMessage = handleApiError(error, setError, showToast, fallbackMessage);
        return { success: false, error: errorMessage };
    }
};