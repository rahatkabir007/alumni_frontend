import { AnimatedCard, CountUp, FloatingElements, ScrollReveal, StaggerContainer } from "@/components/animations"
import BlackTag from "./BlackTag"

const StatisticsSection = ({
    tag = "",
    title = "CIHS Alumni Network by Numbers",
    statistics = "",
}) => {
    return (
        <ScrollReveal direction="up" delay={0.3}>
            <section className="py-12 sm:py-16 bg-black text-white relative">
                <FloatingElements count={6} className="opacity-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal direction="fade" delay={0.1}>
                        <div className="text-center mb-12">
                            {tag && <BlackTag className="mb-4 bg-white text-black">{tag}</BlackTag>}
                            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 px-4">
                                {title}
                            </h2>
                        </div>

                    </ScrollReveal>

                    <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {statistics?.map((stat, index) => (
                            <AnimatedCard key={index} className="text-center">
                                <CountUp
                                    to={stat.number}
                                    suffix={stat.suffix}
                                    duration={2 + index * 0.3}
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 block"
                                    threshold={0.3}
                                />
                                <div className="text-gray-300 text-xs sm:text-sm lg:text-base px-1">{stat.label}</div>
                            </AnimatedCard>
                        ))}
                    </StaggerContainer>
                </div>
            </section>
        </ScrollReveal>
    )
}

export default StatisticsSection