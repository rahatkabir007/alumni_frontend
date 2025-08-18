"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import IntroSection from '@/components/common/IntroSection'
import TeacherCard from './TeacherCard'
import { useGetTeacherManagementListQuery } from '@/redux/features/teacherManagement/teacherManagementApi'
import Pagination from '@/components/common/Pagination'

const TeachersPage = () => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState('desc')
    const [selectedDepartment, setSelectedDepartment] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [selectedAlumniType, setSelectedAlumniType] = useState('all')

    const getQueryParams = () => {
        const baseParams = {
            page: currentPage,
            limit: 12,
            search: debouncedSearch,
            sortBy,
            sortOrder,
            excludeAdmins: true,
            status: selectedStatus,
        }
        return { ...baseParams }
    }

    const { data, isLoading, isFetching, error, refetch } = useGetTeacherManagementListQuery(
        getQueryParams(),
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Filter teachers locally based on additional criteria
    const filteredTeachers = (data?.users || []).filter(teacher => {
        const additionalInfo = teacher.additional_information ?
            (typeof teacher.additional_information === 'string' ?
                JSON.parse(teacher.additional_information) :
                teacher.additional_information) : {}

        // Filter by department
        if (selectedDepartment !== 'all' && additionalInfo.department !== selectedDepartment) {
            return false
        }

        // Filter by alumni type
        if (selectedAlumniType !== 'all' && teacher.alumni_type !== selectedAlumniType) {
            return false
        }

        return true
    })

    // Get unique departments from the data for filter options
    const getUniqueDepartments = () => {
        const departments = new Set(['all'])
        data?.users?.forEach(teacher => {
            const additionalInfo = teacher.additional_information ?
                (typeof teacher.additional_information === 'string' ?
                    JSON.parse(teacher.additional_information) :
                    teacher.additional_information) : {}

            if (additionalInfo.department) {
                departments.add(additionalInfo.department)
            }
        })
        return Array.from(departments)
    }

    const departments = getUniqueDepartments()
    const statuses = ['all', 'active', 'pending', 'inactive']
    const alumniTypes = ['all', 'teacher', 'management']

    const users = filteredTeachers
    const pagination = {
        current: currentPage,
        pageSize: data?.itemsPerPage || 12,
        total: data?.totalItems || 0,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
    }

    const handleSearchChange = (e) => setSearchTerm(e.target.value)
    const handlePageChange = (page) => setCurrentPage(page)

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <IntroSection
                tag='Faculty'
                title='Our Distinguished Teachers'
                description='Meet the dedicated educators who have shaped generations of students at CIHS. From seasoned veterans to current faculty, each teacher has contributed to our legacy of excellence.'
            />

            {/* Search and Filters */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Search Bar */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative max-w-md w-full">
                                <input
                                    type="text"
                                    placeholder="Search teachers by name, designation, or department..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                                />
                                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Filter Options */}
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Type:</label>
                                <select
                                    value={selectedAlumniType}
                                    onChange={(e) => setSelectedAlumniType(e.target.value)}
                                    className="border-2 border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {alumniTypes?.map(type => (
                                        <option key={type} value={type}>
                                            {type === 'all' ? 'All Types' :
                                                type === 'teacher' ? 'Teachers' : 'Management'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Department:</label>
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="border-2 border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {departments?.map(dept => (
                                        <option key={dept} value={dept}>
                                            {dept === 'all' ? 'All Departments' : dept}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Status:</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="border-2 border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {statuses?.map(status => (
                                        <option key={status} value={status}>
                                            {status === 'all' ? 'All Status' :
                                                status === 'active' ? 'Active' :
                                                    status === 'pending' ? 'Pending' : 'Inactive'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <BlackTag size="sm">
                                Showing {users.length} faculty members
                            </BlackTag>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Teachers Grid */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh]">
                        {(isLoading || isFetching) ? (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading faculty members...</p>
                            </div>
                        ) : (
                            <>
                                {users.length > 0 ? (
                                    <div className='flex flex-col gap-8'>
                                        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            {users?.map((teacher) => (
                                                <TeacherCard key={teacher?.id} teacher={teacher} />
                                            ))}
                                        </StaggerContainer>

                                        <Pagination
                                            currentPage={currentPage}
                                            itemsPerPage={pagination.pageSize}
                                            totalItems={pagination.total}
                                            onPageChange={handlePageChange}
                                            isLoading={isLoading || isFetching}
                                            totalPages={Math.ceil(pagination.total / pagination.pageSize)}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <div className="text-4xl mb-4">👨‍🏫</div>
                                        <h3 className="text-lg font-semibold mb-2">No Faculty Members Found</h3>
                                        <p>No teachers or management found matching your criteria.</p>
                                        {(searchTerm || selectedDepartment !== 'all' || selectedStatus !== 'all' || selectedAlumniType !== 'all') && (
                                            <button
                                                onClick={() => {
                                                    setSearchTerm('')
                                                    setSelectedDepartment('all')
                                                    setSelectedStatus('all')
                                                    setSelectedAlumniType('all')
                                                }}
                                                className="mt-4 text-blue-600 hover:text-blue-800 underline"
                                            >
                                                Clear all filters
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </ScrollReveal>

            {/* Join Faculty CTA */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Interested in Teaching at CIHS?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Join our dedicated team of educators and help shape the next generation of leaders.
                        </p>
                        <div className='flex justify-center items-center'>
                            <BlackButton
                                onClick={() => router.push('/contact')}
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200"
                            >
                                Contact HR Department
                            </BlackButton>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default TeachersPage
