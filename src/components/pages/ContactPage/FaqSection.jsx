import { ScrollReveal } from '@/components/animations'
import BlackTag from '@/components/common/BlackTag'
import ElegantCard from '@/components/common/ElegantCard'
import { faqList } from '@/datas/contactPage'
import React from 'react'

const FaqSection = () => {
    return (
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
                        {faqList.map((faq, index) => (
                            <ElegantCard key={index} className="text-left">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h4>
                                <p className="text-gray-600">{faq.answer}</p>
                            </ElegantCard>
                        ))}
                    </div>
                </div>
            </section>
        </ScrollReveal>
    )
}

export default FaqSection