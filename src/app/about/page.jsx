"use client"
import React from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import AnimatedCard from '@/components/animations/AnimatedCard'

const AboutPage = () => {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            About Alumni Network
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Connecting graduates worldwide to build meaningful relationships,
                            share opportunities, and create lasting impact in their communities.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* Mission Section */}
            <ScrollReveal direction="left" delay={0.3}>
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                                <p className="text-gray-600 mb-6">
                                    We believe that the connections formed during education should last a lifetime.
                                    Our platform bridges the gap between past, present, and future, creating a
                                    vibrant ecosystem where alumni can thrive together.
                                </p>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
                                >
                                    Learn More
                                </motion.div>
                            </div>
                            <div className="bg-blue-100 h-64 rounded-lg flex items-center justify-center">
                                <span className="text-4xl">🎯</span>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Values Section */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="fade" delay={0.1}>
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                                Our Core Values
                            </h2>
                        </ScrollReveal>

                        <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: '🤝',
                                    title: 'Connection',
                                    description: 'Fostering meaningful relationships that transcend geographical and professional boundaries.'
                                },
                                {
                                    icon: '🌟',
                                    title: 'Excellence',
                                    description: 'Committed to providing the highest quality platform and services for our alumni community.'
                                },
                                {
                                    icon: '💡',
                                    title: 'Innovation',
                                    description: 'Continuously evolving to meet the changing needs of our global alumni network.'
                                }
                            ].map((value, index) => (
                                <AnimatedCard key={index} className="text-center p-6" hoverScale={1.05}>
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                        className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <span className="text-2xl">{value.icon}</span>
                                    </motion.div>
                                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </AnimatedCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Team Section */}
            <ScrollReveal direction="right" delay={0.3}>
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="scale" delay={0.1}>
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                                Meet Our Team
                            </h2>
                        </ScrollReveal>

                        <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-4 gap-6">
                            {[
                                { name: 'John Doe', role: 'CEO & Founder', avatar: 'JD' },
                                { name: 'Jane Smith', role: 'CTO', avatar: 'JS' },
                                { name: 'Mike Johnson', role: 'Head of Community', avatar: 'MJ' },
                                { name: 'Sarah Wilson', role: 'Lead Developer', avatar: 'SW' }
                            ].map((member, index) => (
                                <AnimatedCard key={index} className="text-center" hoverScale={1.05}>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-4"
                                    >
                                        {member.avatar}
                                    </motion.div>
                                    <h3 className="font-semibold">{member.name}</h3>
                                    <p className="text-sm text-gray-600">{member.role}</p>
                                </AnimatedCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default AboutPage