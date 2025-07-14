import { ScrollReveal } from "@/components/animations"
import TestimonialSlider from "./TestimonialSlider"
import BlackTag from "@/components/common/BlackTag"

const TestimonialsSection = ({

}) => {
    return (
        <ScrollReveal direction="up" delay={0.2}>
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal direction="scale" delay={0.1}>
                        <div className="text-center mb-8 sm:mb-12">
                            <BlackTag className="mb-3 sm:mb-4">Testimonials</BlackTag>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 px-4">
                                What Our Alumni & Teachers Say
                            </h2>
                        </div>
                    </ScrollReveal>

                    <TestimonialSlider />
                </div>
            </section>
        </ScrollReveal>
    )
}

export default TestimonialsSection