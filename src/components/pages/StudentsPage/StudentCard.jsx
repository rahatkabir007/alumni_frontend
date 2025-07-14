import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import ElegantCard from '@/components/common/ElegantCard'
import Link from 'next/link'
import React from 'react'

const StudentCard = ({ student }) => {
    return (
        <ElegantCard key={student.id} className="overflow-hidden group">
            <div className="relative">
                <div
                    className="h-48 bg-gradient-to-br from-blue-400 to-green-400"
                    style={{
                        backgroundImage: `url(${student.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <BlackTag
                    className="absolute top-4 right-4"
                    size="xs"
                >
                    Batch {student.batch}
                </BlackTag>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{student.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{student.profession}</p>
                <p className="text-gray-600 text-sm mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {student.location}
                </p>
                <p className="text-gray-700 text-sm mb-4">{student.achievements}</p>
                <div className="flex justify-between items-center">
                    <BlackTag variant="subtle" size="xs">
                        Class {student.class} Graduate
                    </BlackTag>
                    <Link href={`/students/${student.id}`}>
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

export default StudentCard