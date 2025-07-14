import { ScrollReveal } from "../animations"
import BlackTag from "./BlackTag"

const IntroSection = ({
    tag = 'About CIHS',
    title = 'Chittagong Ideal High School',
    description = 'Excellence in Education Since 1998. Nurturing minds, building character, and creating future leaders for over two decades.',
}) => {
    return (
        <ScrollReveal direction="up" delay={0.2}>
            <section className="py-16 bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <BlackTag className="mb-4 bg-white text-black">{tag}</BlackTag>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {title}
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto text-gray-300">
                        {description}
                    </p>
                </div>
            </section>
        </ScrollReveal>
    )
}

export default IntroSection