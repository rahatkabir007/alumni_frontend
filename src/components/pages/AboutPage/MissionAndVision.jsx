import { ScrollReveal } from "@/components/animations"
import BlackTag from "@/components/common/BlackTag"
import ElegantCard from "@/components/common/ElegantCard"

const MissionAndVision = ({

}) => {
    return (
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
    )
}

export default MissionAndVision