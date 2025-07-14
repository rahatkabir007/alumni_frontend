// "use client"
import React from 'react'
import { ScrollReveal } from '@/components/animations'
import BlackTag from '@/components/common/BlackTag'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'

const AboutSection = () => {
    const router = useRouter()

    return (
        <ScrollReveal direction="up" delay={0.2}>
            <section className="py-8 sm:py-12 lg:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <ScrollReveal direction="left" delay={0.3}>
                            <div className="order-2 lg:order-1">
                                <BlackTag className="mb-3 sm:mb-4">Established 1998</BlackTag>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                                    About Chittagong Ideal High School
                                </h2>
                                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                                    Established in 1998, Chittagong Ideal High School (CIHS) has been a beacon of
                                    educational excellence in Chittagong. From nursery to class 10, we have nurtured
                                    thousands of students who have gone on to become leaders in various fields around the world.
                                </p>
                                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                                    Our commitment to quality education, moral values, and character building has
                                    produced graduates who are not only academically successful but also responsible
                                    citizens contributing to society.
                                </p>
                                <BlackButton
                                    onClick={() => router.push('/about')}
                                    className="w-full sm:w-auto"
                                    icon={
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    }
                                >
                                    Learn More About CIHS
                                </BlackButton>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={0.4}>
                            <ElegantCard className="relative overflow-hidden order-1 lg:order-2">
                                <Image
                                    src="/images/cihs-main-building.jpg"
                                    alt="CIHS Main Building"
                                    width={500}
                                    height={256}
                                    className="rounded-lg w-full h-48 sm:h-56 lg:h-64 object-cover"
                                    style={{ backgroundColor: '#e5e7eb' }}
                                />
                                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-black text-white p-2 sm:p-4 rounded-lg shadow-lg">
                                    <div className="text-lg sm:text-2xl font-bold">27+</div>
                                    <div className="text-xs sm:text-sm">Years of Excellence</div>
                                </div>
                            </ElegantCard>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </ScrollReveal>

    )
}

export default AboutSection