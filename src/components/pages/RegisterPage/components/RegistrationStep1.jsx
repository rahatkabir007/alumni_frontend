"use client"
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { RegistrationStep1Schema } from '@/utils/validationSchemas';
import { alumniTypeOptions, branchOptions, bloodGroupOptions } from '@/utils/formOptions';
import InputComponent1 from '@/components/common/InputComponent1';
import SelectComponent1 from '@/components/common/SelectComponent1';

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
                    blood_group: formData.blood_group || '',
                    joinedYear: formData.joinedYear || '',
                    batch: formData.batch || '',
                    isGraduated: formData.isGraduated !== undefined ? formData.isGraduated : true,
                    graduationYear: formData.graduationYear || '',
                    leftAt: formData.leftAt || '',
                }}
                validationSchema={RegistrationStep1Schema}
                onSubmit={onNext}
            >
                {({ isValid, values, setFieldValue }) => (
                    <Form className="space-y-6">
                        <div className="space-y-4">
                            {/* Basic Info */}
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

                            <InputComponent1
                                name="phone"
                                type="tel"
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
                                placeholder="Enter your complete address"
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                            />

                            {/* Institution Info */}
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
                                name="joinedYear"
                                type="number"
                                label="Year Joined CIHS"
                                placeholder="Year you joined"
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                            />

                            <SelectComponent1
                                name="blood_group"
                                label="Blood Group"
                                placeholder="Select your blood group"
                                options={bloodGroupOptions}
                                required
                                useFormik={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/20"
                            />

                            {/* Student-specific fields */}
                            {values.alumni_type === 'student' && (
                                <>
                                    <InputComponent1
                                        name="batch"
                                        label="Batch/Class"
                                        placeholder="e.g., '15, '20"
                                        required
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/20"
                                    />

                                    {/* Education Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Education Status <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center space-x-6">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isGraduated"
                                                    checked={values.isGraduated === true}
                                                    onChange={() => setFieldValue('isGraduated', true)}
                                                    className="mr-2 text-black focus:ring-black"
                                                />
                                                <span className="text-sm text-gray-900">Graduated</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isGraduated"
                                                    checked={values.isGraduated === false}
                                                    onChange={() => setFieldValue('isGraduated', false)}
                                                    className="mr-2 text-black focus:ring-black"
                                                />
                                                <span className="text-sm text-gray-900">Left Early</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Conditional Year Fields */}
                                    {values.isGraduated ? (
                                        <InputComponent1
                                            name="graduationYear"
                                            type="number"
                                            label="Graduation Year"
                                            placeholder="Year you graduated"
                                            required
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/20"
                                        />
                                    ) : (
                                        <InputComponent1
                                            name="leftAt"
                                            type="number"
                                            label="Year Left School"
                                            placeholder="Year you left school"
                                            required
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/20"
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        >
                            Continue
                        </motion.button>
                    </Form>
                )}
            </Formik>
        </motion.div>
    )
}

export default RegistrationStep1

