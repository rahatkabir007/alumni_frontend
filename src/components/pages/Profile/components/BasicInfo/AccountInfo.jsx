"use client"

const AccountInfo = ({ userData }) => {
    return (
        <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                    <span className="text-gray-500">User ID:</span>
                    <span className="ml-2 text-gray-900">{userData.id}</span>
                </div>
                <div>
                    <span className="text-gray-500">Account Status:</span>
                    <span className={`ml-2 ${userData.status === "pending" ? 'text-yellow-600' : userData.status === "active" ? 'text-green-600' : 'text-red-600'}`}>
                        {userData.status === "active" ? 'Active' : userData.status === "inactive" ? 'Inactive' : 'Not Verified'}
                        {userData.status === 'pending' && (
                            <button
                                className="ml-2 px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition"
                                type="button"
                            >
                                Apply for Verification
                            </button>
                        )}
                    </span>
                </div>
                <div>
                    <span className="text-gray-500">Member Since:</span>
                    <span className="ml-2 text-gray-900">
                        {userData.createdAt || userData.created_at ?
                            new Date(userData.createdAt || userData.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
                <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="ml-2 text-gray-900">
                        {userData.updatedAt || userData.updated_at ?
                            new Date(userData.updatedAt || userData.updated_at).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AccountInfo
