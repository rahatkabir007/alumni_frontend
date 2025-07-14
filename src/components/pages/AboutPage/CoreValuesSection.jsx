import { ScrollReveal, StaggerContainer } from "@/components/animations"
import BlackTag from "@/components/common/BlackTag"
import ElegantCard from "@/components/common/ElegantCard"
import { coreValues } from "@/datas/aboutPage"

const CoreValuesSection = ({

}) => {
    return (
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
                        {coreValues.map((value, index) => (
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
    )
}

export default CoreValuesSection