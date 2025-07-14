"use client"
import React from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlackButton from '@/components/common/BlackButton'
import IntroSection from '@/components/common/IntroSection'
import FaqSection from './FaqSection'
import ContactInfoSection from './ContactInfoSection'
import ContactForm from './ContactForm'
import Location from './Location'
import DepartmentSection from './DepartmentSection'

const ContactPage = () => {

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <IntroSection
                tag='Contact'
                title="Get in Touch"
                description='We are here to assist you with any inquiries or support you may need. Whether you have questions about our alumni services, want to get involved, or need assistance with your account, our team is ready to help.'
            />

            {/* FAQ Section */}
            <FaqSection />

            {/* Contact Info Cards */}
            <ContactInfoSection />

            {/* Contact Form & Map */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <ContactForm />

                            {/* School Location & Map */}
                            <Location />
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Department Contacts */}
            <DepartmentSection />

            {/* Emergency Contact */}
            <ScrollReveal direction="up" delay={0.7}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Need Immediate Assistance?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            For urgent matters or emergencies related to CIHS alumni services
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <BlackButton
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                }
                            >
                                Call Emergency Line
                            </BlackButton>
                            <BlackButton
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white hover:text-black"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                }
                            >
                                Send Priority Email
                            </BlackButton>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default ContactPage
