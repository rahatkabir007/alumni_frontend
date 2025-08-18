import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import ElegantCard from '@/components/common/ElegantCard'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const TeacherCard = ({ teacher }) => {
    // Parse additional information
    const additionalInfo = teacher.additional_information ?
        (typeof teacher.additional_information === 'string' ?
            JSON.parse(teacher.additional_information) :
            teacher.additional_information) : {}

    // Helper for initials
    const getInitials = (name) => {
        if (!name) return 'T'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0]
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    // Determine status from additional info or default to active
    const teacherStatus = additionalInfo.teacherStatus || additionalInfo.managementStatus || 'active'

    return (
        <ElegantCard key={teacher.id} className="overflow-hidden group p-0">
            {/* Profile Photo or Initials */}
            <div className="relative flex items-center justify-center h-40 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg">
                {teacher?.profilePhoto ? (
                    <Image
                        width={400}
                        height={400}
                        src={teacher.profilePhoto}
                        alt={teacher.name}
                        className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                ) : (
                    <div className="h-28 w-28 rounded-full flex items-center justify-center bg-gray-200 text-black text-4xl font-bold border-4 border-white shadow-lg">
                        {getInitials(teacher.name)}
                    </div>
                )}

                {/* Status Badge */}
                {/* <BlackTag
                    className={`absolute top-4 right-4 ${teacherStatus === 'active' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}
                    size="xs"
                >
                    {teacherStatus === 'active' ? 'Current Faculty' : 'Retired'}
                </BlackTag> */}

                {/* Alumni Type Badge */}
                {teacher.alumni_type && (
                    <BlackTag className="absolute top-4 left-4 bg-blue-600 text-white" size="xs">
                        {teacher.alumni_type === 'teacher' ? 'Teacher' : 'Management'}
                    </BlackTag>
                )}
            </div>

            {/* Main Info */}
            <div className="p-5 flex flex-col gap-2">
                <h3 className="text-lg font-bold text-gray-900 truncate">{teacher.name}</h3>

                {/* Designation from additional info or profession */}
                {(additionalInfo.designation || teacher.profession) && (
                    <p className="text-blue-600 font-medium text-sm truncate">
                        {additionalInfo.designation || teacher.profession}
                    </p>
                )}

                {/* Department and period */}
                {(additionalInfo.department || additionalInfo.period) && (
                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-3 0h4" />
                        </svg>
                        {additionalInfo.department && additionalInfo.period ?
                            `${additionalInfo.department} • ${additionalInfo.period}` :
                            additionalInfo.department || additionalInfo.period}
                    </p>
                )}

                {/* Contact Information */}
                <div className="flex flex-col gap-1 mt-1">
                    {teacher.email && (
                        <div className="flex items-center text-gray-500 text-xs">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {teacher.email}
                        </div>
                    )}
                    {teacher.phone && (
                        <div className="flex items-center text-gray-500 text-xs">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {teacher.phone}
                        </div>
                    )}
                    {teacher.location && (
                        <div className="flex items-center text-gray-500 text-xs">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {teacher.location}
                        </div>
                    )}
                    {teacher.branch && (
                        <div className="flex items-center text-gray-500 text-xs">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {teacher.branch} Branch
                        </div>
                    )}
                </div>

                {/* Specialization or Subject */}
                {(additionalInfo.specialization || additionalInfo.subject) && (
                    <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                            {additionalInfo.specialization ? 'Specialization:' : 'Subject:'}
                        </h4>
                        <BlackTag variant="subtle" size="xs">
                            {additionalInfo.specialization || additionalInfo.subject}
                        </BlackTag>
                    </div>
                )}

                {/* Office Hours */}
                {additionalInfo.officeHours && (
                    <div className="mb-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Office Hours:</h4>
                        <p className="text-xs text-gray-600">{additionalInfo.officeHours}</p>
                    </div>
                )}

                {/* Achievements or Quote */}
                {additionalInfo.achievements && Array.isArray(additionalInfo.achievements) && additionalInfo.achievements.length > 0 && (
                    <p className="text-gray-700 text-xs mt-2 line-clamp-2">
                        {additionalInfo.achievements[0]}
                    </p>
                )}
                {additionalInfo.quotes && (
                    <p className="text-gray-700 text-xs mt-2 line-clamp-2 italic">
                        "{additionalInfo.quotes}"
                    </p>
                )}

                {/* View Profile Button */}
                <div className="flex justify-end mt-4">
                    <Link href={`/teachers/${teacher.id}`}>
                        <BlackButton
                            size="sm"
                            variant="filled"
                            className="rounded-full px-5 py-2 shadow-md bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black transition-all text-white cursor-pointer"
                            icon={
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            }
                        >
                            View Profile
                        </BlackButton>
                    </Link>
                </div>
            </div>
        </ElegantCard>
    )
}

export default TeacherCard