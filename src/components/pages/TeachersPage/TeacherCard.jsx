import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import ElegantCard from '@/components/common/ElegantCard'
import Link from 'next/link'
import React from 'react'

const TeacherCard = ({ teacher }) => {
    return (
        <ElegantCard key={teacher.id} className="overflow-hidden">
            <div className="relative">
                <div
                    className="h-48 bg-gradient-to-br from-blue-600 to-emerald-600"
                    style={{
                        backgroundImage: `url(${teacher.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <BlackTag
                    className={`absolute top-4 right-4 ${teacher.status === 'active' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}
                    size="xs"
                >
                    {teacher.status === 'active' ? 'Current Faculty' : 'Retired'}
                </BlackTag>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{teacher.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{teacher.designation}</p>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-3 0h4" />
                    </svg>
                    {teacher.department} • {teacher.period}
                </p>

                <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Specialization:</h4>
                    <BlackTag variant="subtle" size="xs">{teacher.specialization}</BlackTag>
                </div>

                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Subjects:</h4>
                    <div className="flex flex-wrap gap-1">
                        {teacher.subjects.slice(0, 2).map((subject, index) => (
                            <BlackTag key={index} variant="outline" size="xs">
                                {subject}
                            </BlackTag>
                        ))}
                        {teacher.subjects.length > 2 && (
                            <BlackTag variant="subtle" size="xs">
                                +{teacher.subjects.length - 2} more
                            </BlackTag>
                        )}
                    </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{teacher.achievements}</p>

                <div className="flex justify-between items-center">
                    <BlackTag variant="subtle" size="xs">{teacher.department}</BlackTag>
                    <Link href={`/teachers/${teacher.id}`}>
                        <BlackButton
                            size="sm"
                            variant="outline"
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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