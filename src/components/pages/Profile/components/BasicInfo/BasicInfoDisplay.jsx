"use client"

const BasicInfoDisplay = ({ userData }) => {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                    {userData.name || 'Not provided'}
                </p>
            </div>

            {/* Phone Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                    {userData.phone || 'Not provided'}
                </p>
            </div>

            {/* Branch */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                    {userData.branch || 'Not provided'}
                </p>
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                    {userData.location || 'Not provided'}
                </p>
            </div>

            {/* Blood Group */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                    {userData.blood_group || 'Not provided'}
                </p>
            </div>

            {/* Current Profession */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Profession
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                    {userData.profession || 'Not provided'}
                </p>
            </div>

            {/* Password Field - Always shown but disabled */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                    ••••••••••••
                </p>
            </div>

            {userData?.alumni_type === "student" && (
                <>
                    {/* Batch/Class */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Batch/Class
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                            {userData.batch || 'Not provided'}
                        </p>
                    </div>

                    {/* Education Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Education Status
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                            {userData.isGraduated ? 'Graduated' : 'Left Early'}
                        </p>
                    </div>

                    {/* Graduation/Left Year */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {userData.isGraduated ? "Graduation Year" : "Year Left School"}
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                            {userData.isGraduated
                                ? (userData.graduationYear || userData.graduation_year || 'Not provided')
                                : (userData.leftAt || userData.left_at || 'Not provided')
                            }
                        </p>
                    </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joined CIHS
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">
                    {userData.joinedYear || "Not provided"}
                </p>
            </div>

            {/* Bio - Full width */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio/About Me
                </label>
                <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-transparent min-h-[100px] whitespace-pre-wrap">
                    {userData.bio || 'No bio provided'}
                </div>
            </div>
        </div>
    )
}

export default BasicInfoDisplay
