import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import ElegantCard from '@/components/common/ElegantCard'
import Link from 'next/link'

const OldStudentCard = ({ student }) => {
    return (
        <ElegantCard key={student.id} className="overflow-hidden group">
            <div className="relative">
                {
                    student?.profilePhoto ? <div
                        className="h-48 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg"
                        style={{
                            backgroundImage: `url(${student.profilePhoto})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    /> : <div className="h-48 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-5xl font-bold">
                        <span>{student.name.charAt(0)}</span>
                    </div>

                }
                {
                    student?.batch && <BlackTag
                        className="absolute top-4 right-4"
                        size="xs"
                    >
                        Batch {student.batch}
                    </BlackTag>
                }
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{student.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{student.profession}</p>

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

export default OldStudentCard