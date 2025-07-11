"use client"
import React, { useState } from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.')
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                category: 'general',
                message: ''
            })
            setIsSubmitting(false)
        }, 2000)
    }

    const contactInfo = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Visit Us',
            details: ['Chittagong Ideal High School', 'Nasirabad, Chittagong-4220', 'Bangladesh'],
            link: 'https://maps.google.com'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: 'Call Us',
            details: ['+880-31-123-4567', '+880-31-765-4321', 'Mon - Fri: 9:00 AM - 5:00 PM'],
            link: 'tel:+880311234567'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Email Us',
            details: ['alumni@cihs.edu.bd', 'info@cihs.edu.bd', 'We reply within 24 hours'],
            link: 'mailto:alumni@cihs.edu.bd'
        }
    ]

    const departments = [
        {
            name: 'Alumni Relations',
            head: 'Mr. Rahman Ali',
            email: 'alumni@cihs.edu.bd',
            phone: '+880-31-123-4567',
            description: 'Alumni networking, events, and community building'
        },
        {
            name: 'Academic Affairs',
            head: 'Dr. Fatima Rahman',
            email: 'academic@cihs.edu.bd',
            phone: '+880-31-123-4568',
            description: 'Student records, transcripts, and academic queries'
        },
        {
            name: 'Career Services',
            head: 'Ms. Nasreen Ahmed',
            email: 'career@cihs.edu.bd',
            phone: '+880-31-123-4569',
            description: 'Career guidance, job placements, and mentorship'
        },
        {
            name: 'Development Office',
            head: 'Mr. Karim Hassan',
            email: 'development@cihs.edu.bd',
            phone: '+880-31-123-4570',
            description: 'Donations, scholarships, and institutional development'
        }
    ]

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <BlackTag className="mb-4 bg-white text-black">Contact</BlackTag>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto text-gray-300">
                            We&apos;re here to help! Whether you have questions, need assistance, or want to get involved with the CIHS alumni community, don&apos;t hesitate to reach out.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* Contact Info Cards */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-8">
                            {contactInfo.map((info, index) => (
                                <ElegantCard key={index} className="text-center group cursor-pointer" hover={true}>
                                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        {info.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                                    <div className="space-y-1">
                                        {info.details.map((detail, idx) => (
                                            <p key={idx} className="text-gray-600">{detail}</p>
                                        ))}
                                    </div>
                                </ElegantCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Contact Form & Map */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <ElegantCard>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                                placeholder="+880-XXX-XXXXXXX"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                                Category
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                            >
                                                <option value="general">General Inquiry</option>
                                                <option value="alumni">Alumni Services</option>
                                                <option value="events">Events & Programs</option>
                                                <option value="careers">Career Services</option>
                                                <option value="donations">Donations & Support</option>
                                                <option value="academic">Academic Records</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                            placeholder="Brief subject of your message"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={6}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                                            placeholder="Please provide details about your inquiry..."
                                        />
                                    </div>

                                    <BlackButton
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending Message...' : 'Send Message'}
                                    </BlackButton>
                                </form>
                            </ElegantCard>

                            {/* School Location & Map */}
                            <div className="space-y-6">
                                <ElegantCard>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">School Location</h3>
                                    <div className="h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p>Interactive Map</p>
                                            <p className="text-sm">Google Maps Integration</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><strong>Address:</strong> Chittagong Ideal High School</p>
                                        <p>Nasirabad, Chittagong-4220, Bangladesh</p>
                                        <p><strong>Landmark:</strong> Near Nasirabad Government High School</p>
                                    </div>
                                </ElegantCard>

                                <ElegantCard>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Office Hours</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Monday - Thursday</span>
                                            <span className="font-medium">9:00 AM - 5:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Friday</span>
                                            <span className="font-medium">9:00 AM - 12:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Saturday</span>
                                            <span className="font-medium">10:00 AM - 2:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Sunday</span>
                                            <span className="font-medium text-red-600">Closed</span>
                                        </div>
                                    </div>
                                </ElegantCard>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Department Contacts */}
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
                            {departments.map((dept, index) => (
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

            {/* FAQ Section */}
            <ScrollReveal direction="up" delay={0.6}>
                <section className="py-12 bg-gray-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <BlackTag className="mb-4">FAQ</BlackTag>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    question: "How can I join the alumni network?",
                                    answer: "You can join by registering on our website with your CIHS graduation details. We verify all applications to maintain the integrity of our community."
                                },
                                {
                                    question: "How do I update my contact information?",
                                    answer: "Log into your alumni account and update your profile information. You can also contact our Alumni Relations department for assistance."
                                },
                                {
                                    question: "Can I organize an alumni event?",
                                    answer: "Yes! We encourage alumni-led events. Contact our Events Committee to discuss your ideas and get support for organizing gatherings."
                                },
                                {
                                    question: "How can I contribute to CIHS scholarships?",
                                    answer: "Contact our Development Office to learn about scholarship opportunities and ways to support current students through donations or mentorship."
                                }
                            ].map((faq, index) => (
                                <ElegantCard key={index} className="text-left">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h4>
                                    <p className="text-gray-600">{faq.answer}</p>
                                </ElegantCard>
                            ))}
                        </div>
                    </div>
                </section>
            </ScrollReveal>

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
