"use client"
import React from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import AnimatedCard from '@/components/animations/AnimatedCard'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import CountUp from '@/components/animations/CountUp'

const AboutPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <BlackTag className="mb-4 bg-white text-black">About CIHS</BlackTag>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Chittagong Ideal High School
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto text-gray-300">
                            Excellence in Education Since 1965. Nurturing minds, building character,
                            and creating future leaders for over five decades.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* School History */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <ScrollReveal direction="left" delay={0.3}>
                                <div>
                                    <BlackTag className="mb-4">Our History</BlackTag>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">A Legacy of Excellence</h2>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Founded in 1965, Chittagong Ideal High School began as a vision to provide
                                        quality education to the children of Chittagong. What started as a small
                                        institution has grown into one of the most prestigious schools in the region.
                                    </p>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Our school has consistently maintained its reputation for academic excellence,
                                        moral values, and character development. We have produced doctors, engineers,
                                        teachers, business leaders, and public servants who are making their mark
                                        around the world.
                                    </p>
                                    <BlackButton variant="outline">
                                        Read Full History
                                    </BlackButton>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal direction="right" delay={0.4}>
                                <ElegantCard className="relative">
                                    <div
                                        className="h-64 rounded-lg bg-gradient-to-br from-blue-400 to-green-400"
                                        style={{
                                            backgroundImage: 'url(/images/cihs-historical.jpg)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                </ElegantCard>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* School Statistics */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="fade" delay={0.1}>
                            <div className="text-center mb-12">
                                <BlackTag className="mb-4 bg-white text-black">Statistics</BlackTag>
                                <h2 className="text-3xl font-bold">CIHS by the Numbers</h2>
                            </div>
                        </ScrollReveal>

                        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { number: 58, label: 'Years of Excellence', suffix: '+' },
                                { number: 15000, label: 'Alumni Worldwide', suffix: '+' },
                                { number: 500, label: 'Current Students', suffix: '+' },
                                { number: 50, label: 'Dedicated Teachers', suffix: '+' }
                            ].map((stat, index) => (
                                <ElegantCard key={index} background="black" className="text-center border-gray-700">
                                    <CountUp
                                        to={stat.number}
                                        suffix={stat.suffix}
                                        duration={2 + index * 0.3}
                                        className="text-3xl md:text-4xl font-bold mb-2 block text-white"
                                        threshold={0.3}
                                    />
                                    <div className="text-gray-300">{stat.label}</div>
                                </ElegantCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Mission & Vision */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="fade" delay={0.1}>
                            <div className="text-center mb-12">
                                <BlackTag className="mb-4">Our Purpose</BlackTag>
                                <h2 className="text-3xl font-bold text-gray-900">Mission & Vision</h2>
                            </div>
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-8">
                            <ElegantCard className="text-center">
                                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To provide quality education that develops intellectual, moral, and social
                                    capabilities of students, preparing them to be responsible citizens and
                                    leaders who contribute positively to society.
                                </p>
                            </ElegantCard>

                            <ElegantCard className="text-center">
                                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To be recognized as the leading educational institution that nurtures
                                    well-rounded individuals equipped with knowledge, skills, and values
                                    to excel in a global society.
                                </p>
                            </ElegantCard>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Core Values */}
            <ScrollReveal direction="up" delay={0.6}>
                <section className="py-16 bg-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="fade" delay={0.1}>
                            <div className="text-center mb-12">
                                <BlackTag className="mb-4">Our Values</BlackTag>
                                <h2 className="text-3xl font-bold text-gray-900">Core Values</h2>
                            </div>
                        </ScrollReveal>

                        <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8">
                            {[{
                                icon: '📚',
                                title: 'Academic Excellence',
                                description: 'Committed to providing the highest quality education and fostering a love for learning.'
                            },
                            {
                                icon: '🤝',
                                title: 'Integrity & Character',
                                description: 'Building strong moral character and ethical leadership in all our students.'
                            },
                            {
                                icon: '🌍',
                                title: 'Global Perspective',
                                description: 'Preparing students to be responsible global citizens and leaders.'
                            },
                            {
                                icon: '💡',
                                title: 'Innovation',
                                description: 'Encouraging creativity, critical thinking, and innovative problem-solving.'
                            },
                            {
                                icon: '🎯',
                                title: 'Excellence',
                                description: 'Striving for excellence in all aspects of education and personal development.'
                            },
                            {
                                icon: '❤️',
                                title: 'Community Service',
                                description: 'Instilling a spirit of service and contribution to the community.'
                            }].map((value, index) => (
                                <ElegantCard key={index} className="text-center group">
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </ElegantCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Achievements */}
            <ScrollReveal direction="up" delay={0.7}>
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="fade" delay={0.1}>
                            <div className="text-center mb-12">
                                <BlackTag className="mb-4">Achievements</BlackTag>
                                <h2 className="text-3xl font-bold text-gray-900">Our Proud Achievements</h2>
                            </div>
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-8">
                            {[{
                                title: 'Academic Recognition',
                                achievements: [
                                    'Top 10 Schools in Chittagong Division',
                                    '95% SSC Pass Rate (2023)',
                                    'National Science Fair Winners',
                                    'Inter-School Debate Champions'
                                ]
                            },
                            {
                                title: 'Alumni Success',
                                achievements: [
                                    'Alumni in 25+ Countries',
                                    'Prominent Leaders in Various Fields',
                                    'Successful Entrepreneurs & Innovators',
                                    'Dedicated Public Servants'
                                ]
                            }].map((section, index) => (
                                <ElegantCard key={index}>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                                    <ul className="space-y-2">
                                        {section.achievements.map((achievement, idx) => (
                                            <li key={idx} className="flex items-center text-gray-600">
                                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {achievement}
                                            </li>
                                        ))}
                                    </ul>
                                </ElegantCard>
                            ))}
                        </div>
                    </div>
                </section>
            </ScrollReveal>

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