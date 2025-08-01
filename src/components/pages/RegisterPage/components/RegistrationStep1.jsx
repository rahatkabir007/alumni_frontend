"use client"
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import InputComponent1 from '@/components/common/InputComponent1';
import SelectComponent1 from '@/components/common/SelectComponent1';

const Step1Schema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    alumni_type: Yup.string()
        .oneOf(['student', 'teacher', 'management'], 'Please select a valid alumni type')
        .required('Alumni type is required'),
    branch: Yup.string()
        .required('Branch is required'),
    phone: Yup.string()
        .required('Phone number is required'),
    location: Yup.string()
        .required('Location is required'),
});

const alumniTypeOptions = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'management', label: 'Management' }
];

const branchOptions = [
    { value: 'Jamalkhan', label: 'Jamalkhan' },
    { value: 'Patiya', label: 'Patiya' }
];

const RegistrationStep1 = ({ formData, onNext }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
        >
            <Formik
                initialValues={{
                    name: formData.name || '',
                    email: formData.email || '',
                    alumni_type: formData.alumni_type || '',
                    branch: formData.branch || '',
                    phone: formData.phone || '',
                    location: formData.location || '',
                }}
                validationSchema={Step1Schema}
                onSubmit={onNext}
            >
                {({ isValid, values }) => (
                    <Form className="space-y-6">
                        <div className="space-y-4">
                            <InputComponent1
                                name="name"
                                type="text"
                                label="Full Name"
                                placeholder="Enter your full name"
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                            />

                            <InputComponent1
                                name="email"
                                type="email"
                                label="Email Address"
                                placeholder="Enter your email address"
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                            />

                            <SelectComponent1
                                name="alumni_type"
                                label="Alumni Type"
                                placeholder="Select your alumni type"
                                options={alumniTypeOptions}
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                            />

                            <SelectComponent1
                                name="branch"
                                label="Branch"
                                placeholder="Select your branch"
                                options={branchOptions}
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                            />

                            <InputComponent1
                                name="phone"
                                type="text"
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                            />

                            <InputComponent1
                                name="location"
                                type="text"
                                label="Location/Address"
                                placeholder="Enter your address"
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        >
                            Continue to Security Setup
                        </motion.button>
                    </Form>
                )}
            </Formik>
        </motion.div>
    )
}

export default RegistrationStep1
