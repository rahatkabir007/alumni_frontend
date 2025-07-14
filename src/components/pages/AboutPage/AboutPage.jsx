"use client"

import React from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlackButton from '@/components/common/BlackButton'
import IntroSection from '@/components/common/IntroSection'
import HistorySection from './HistorySection'
import StatisticsSection from '@/components/common/StatisticsSection'
import { aboutStatistics } from '@/datas/aboutPage'
import MissionAndVision from './MissionAndVision'
import CoreValuesSection from './CoreValuesSection'
import AchievementsSection from './AchievementsSection'

const AboutPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <IntroSection
                tag='About CIHS'
                title='Chittagong Ideal High School'
                description='  Excellence in Education Since 1998. Nurturing minds, building character,
                      and creating future leaders for over two decades.'
            />

            {/* School History */}
            <HistorySection />

            {/* School Statistics */}
            <StatisticsSection
                tag='Statistics'
                title='CIHS by the Numbers'
                statistics={aboutStatistics}
            />

            {/* Mission & Vision */}
            <MissionAndVision />

            {/* Core Values */}
            <CoreValuesSection />

            {/* Achievements */}
            <AchievementsSection />

            {/* CTA Section */}
            <ScrollReveal direction="up" delay={0.8}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Be Part of Our Legacy
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Join our alumni network and stay connected with the CIHS family.
                            Together, we continue to build on our proud legacy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <BlackButton
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200"
                                onClick={() => router.push('/register')}
                            >
                                Join Alumni Network
                            </BlackButton>
                            <BlackButton
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white hover:text-black"
                                onClick={() => router.push('/contact')}
                            >
                                Contact Us
                            </BlackButton>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default AboutPage