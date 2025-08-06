import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import ElegantCard from '@/components/common/ElegantCard'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const StudentCard = ({ student }) => {
    // Helper for initials
    const getInitials = (name) => {
        if (!name) return 'A'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0]
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    return (
        <ElegantCard key={student.id} className="overflow-hidden group p-0">
            {/* Profile Photo or Initials */}
            <div className="relative flex items-center justify-center h-40 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg">
                {student?.profilePhoto ? (
                    <Image
                        width={400}
                        height={400}
                        src={student.profilePhoto}
                        alt={student.name}
                        className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                ) : (
                    <div className="h-28 w-28 rounded-full flex items-center justify-center bg-gray-200 text-black text-4xl font-bold border-4 border-white shadow-lg">
                        {getInitials(student.name)}
                    </div>
                )}
                {student?.batch && (
                    <BlackTag className="absolute top-4 right-4" size="xs">
                        Batch {student.batch}
                    </BlackTag>
                )}
            </div>

            {/* Main Info */}
            <div className="p-5 flex flex-col gap-2">
                <h3 className="text-lg font-bold text-gray-900 truncate">{student.name}</h3>
                {student.profession && (
                    <p className="text-blue-600 font-medium text-sm truncate">{student.profession}</p>
                )}
                <div className="flex flex-col gap-1 mt-1">
                    {student.email && (
                        <div className="flex items-center text-gray-500 text-xs">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm-8 0v4a4 4 0 008 0v-4" />
                            </svg>
                            {student.email}
                        </div>
                    )}
                    {student.phone && (
                        <div className="flex items-center text-gray-500 text-xs">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            {student.phone}
                        </div>
                    )}
                    {student.location && (
                        <div className="flex items-center text-gray-500 text-xs">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {student.location}
                        </div>
                    )}
                    {
                        student.blood_group && (
                            <div className="flex items-center text-gray-500 text-xs">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9V7a3 3 0 00-6 0v2m6 0h6m-6 0v6m0-6a3 3 0 016 0v2m-6 0h-6m6 0v6m0-6a3 3 0 01-6 0v-2" />
                                </svg>
                                {student.blood_group}
                            </div>
                        )
                    }
                </div>
                {/* Achievements or About */}
                {student.achievements && typeof student.achievements === 'string' && (
                    <p className="text-gray-700 text-xs mt-2 line-clamp-2">{student.achievements}</p>
                )}
                {student.achievements && Array.isArray(student.achievements) && student.achievements.length > 0 && (
                    <ul className="text-gray-700 text-xs mt-2 list-disc pl-4">
                        {student.achievements.slice(0, 2).map((ach, idx) => (
                            <li key={idx}>{ach}</li>
                        ))}
                    </ul>
                )}
                {/* View Profile Button */}
                <div className="flex justify-end mt-4">
                    <Link href={`/students/${student.id}`}>
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

export default StudentCard