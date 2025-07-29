import React from "react";

const FloatingVerificationNotice = () => (
    <div className="fixed z-50 bottom-6 right-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 px-6 py-4 rounded-lg shadow-lg animate-bounce">
        <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <span>
                Your account is <b>pending verification</b>. <br />Apply for verification to access all features <br /> and appear in the alumni list.
            </span>
        </div>
    </div>
);

export default FloatingVerificationNotice;