import { ScrollReveal } from "@/components/animations"
import BlackTag from "@/components/common/BlackTag"
import ElegantCard from "@/components/common/ElegantCard"
import { achievements } from "@/datas/aboutPage"

const AchievementsSection = ({

}) => {
    return (
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
                        {achievements?.map((section, index) => (
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
    )
}

export default AchievementsSection