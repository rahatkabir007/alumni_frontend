import { ScrollReveal, StaggerContainer } from '@/components/animations'
import ElegantCard from '@/components/common/ElegantCard'
import { contactInfo } from '@/datas/contactPage'
import React from 'react'

const ContactInfoSection = () => {
    return (
        <ScrollReveal direction="up" delay={0.3}>
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-8">
                        {contactInfo?.map((info, index) => (
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
    )
}

export default ContactInfoSection