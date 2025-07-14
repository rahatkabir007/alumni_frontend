import { ScrollReveal, StaggerContainer } from '@/components/animations'
import BlackTag from '@/components/common/BlackTag'
import ElegantCard from '@/components/common/ElegantCard'
import { departments } from '@/datas/contactPage'
import React from 'react'

const DepartmentSection = () => {
    return (
        <ScrollReveal direction="up" delay={0.5}>
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <BlackTag className="mb-4">Departments</BlackTag>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Department Contacts
                        </h2>
                        <p className="text-lg text-gray-600 mt-4">
                            Connect directly with specific departments for specialized assistance
                        </p>
                    </div>

                    <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {departments?.map((dept, index) => (
                            <ElegantCard key={index} className="text-center" hover={true}>
                                <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-3 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{dept.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                                <div className="space-y-1 text-sm">
                                    <p className="font-medium text-gray-900">{dept.head}</p>
                                    <p className="text-blue-600">{dept.email}</p>
                                    <p className="text-gray-600">{dept.phone}</p>
                                </div>
                            </ElegantCard>
                        ))}
                    </StaggerContainer>
                </div>
            </section>
        </ScrollReveal>
    )
}

export default DepartmentSection