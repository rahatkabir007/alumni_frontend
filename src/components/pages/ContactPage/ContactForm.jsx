import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import InputComponent1 from '@/components/common/InputComponent1'
import TextareaComponent1 from '@/components/common/TextareaComponent1'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import React from 'react'

const ContactSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^[\+]?[0-9\s\-\(\)]*$/, 'Invalid phone number format')
        .min(10, 'Phone number must be at least 10 digits'),
    subject: Yup.string()
        .min(5, 'Subject must be at least 5 characters')
        .max(100, 'Subject must be less than 100 characters')
        .required('Subject is required'),
    category: Yup.string()
        .required('Category is required'),
    message: Yup.string()
        .min(10, 'Message must be at least 10 characters')
        .max(1000, 'Message must be less than 1000 characters')
        .required('Message is required')
});

const ContactForm = () => {
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert('Thank you for your message! We will get back to you soon.');
            resetForm();
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ElegantCard>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    category: 'general',
                    message: ''
                }}
                validationSchema={ContactSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <InputComponent1
                                name="name"
                                type="text"
                                label="Full Name"
                                placeholder="Your full name"
                                required
                                useFormik={true}
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
                                focusBorderColor="focus:border-white/30"
                                focusRingColor="focus:ring-white/20"
                            />

                            <InputComponent1
                                name="email"
                                type="email"
                                label="Email Address"
                                placeholder="your.email@example.com"
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                placeholderColor="placeholder-gray-400"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/10"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <InputComponent1
                                name="phone"
                                type="tel"
                                label="Phone Number"
                                placeholder="+880-XXX-XXXXXXX"
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                placeholderColor="placeholder-gray-400"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/10"
                            />

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={values.category}
                                    onChange={(e) => setFieldValue('category', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black text-gray-900 bg-white transition-all"
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

                        <InputComponent1
                            name="subject"
                            type="text"
                            label="Subject"
                            placeholder="Brief subject of your message"
                            required
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            placeholderColor="placeholder-gray-400"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                        />

                        <TextareaComponent1
                            name="message"
                            label="Message"
                            placeholder="Please provide details about your inquiry..."
                            required
                            useFormik={true}
                            rows={6}
                            maxLength={1000}
                            showCharCount={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            placeholderColor="placeholder-gray-400"
                            resize="resize-none"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                        />

                        <BlackButton
                            type="submit"
                            size="lg"
                            className="w-full"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending Message...' : 'Send Message'}
                        </BlackButton>
                    </Form>
                )}
            </Formik>
        </ElegantCard>
    )
}

export default ContactForm