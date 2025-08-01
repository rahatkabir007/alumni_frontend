"use client"
import { Formik, Form } from 'formik'
import { ProfileUpdateSchema } from '@/utils/validationSchemas'
import { bloodGroupOptions } from '@/utils/formOptions'
import InputComponent1 from '@/components/common/InputComponent1'
import TextareaComponent1 from '@/components/common/TextareaComponent1'
import SelectComponent1 from '@/components/common/SelectComponent1'
import BlackButton from '@/components/common/BlackButton'

const BasicInfoForm = ({ userData, onSave, onCancel, isLoading }) => {
    return (
        <Formik
            initialValues={{
                name: userData.name || '',
                phone: userData.phone || '',
                location: userData.location || '',
                profession: userData.profession || '',
                branch: userData.branch || '',
                blood_group: userData.blood_group || '',
                graduationYear: userData.graduationYear || userData.graduation_year || '',
                batch: userData.batch || '',
                bio: userData.bio || '',
                isGraduated: userData.isGraduated !== undefined ? userData.isGraduated : true,
                leftAt: userData.leftAt || userData.left_at || '',
                joinedYear: userData.joinedYear || userData.joined_year || '',
                alumni_type: userData.alumni_type || 'student' // Add this for conditional validation
            }}
            validationSchema={ProfileUpdateSchema}
            onSubmit={onSave}
        >
            {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                    <div className="grid md:grid-cols-2 gap-6">
                        <InputComponent1
                            name="name"
                            label="Full Name"
                            required
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                        />

                        <InputComponent1
                            name="phone"
                            type="tel"
                            label="Phone Number"
                            placeholder="+880-XXX-XXXXXXX"
                            required
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                        />

                        <SelectComponent1
                            name="branch"
                            label="Branch"
                            placeholder="Select your branch"
                            options={[
                                { value: 'Jamalkhan', label: 'Jamalkhan' },
                                { value: 'Patiya', label: 'Patiya' },
                            ]}
                            required
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                        />

                        <InputComponent1
                            name="location"
                            label="Location/Address"
                            placeholder="Your current location"
                            required
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
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
                            focusRingColor="focus:ring-black/10"
                        />

                        <InputComponent1
                            name="profession"
                            label="Current Profession/Job"
                            placeholder="Your current job or profession"
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                        />

                        {userData?.alumni_type === "student" && (
                            <>
                                <InputComponent1
                                    name="batch"
                                    label="Batch/Class"
                                    placeholder="e.g.,'15, '20"
                                    required
                                    useFormik={true}
                                    backgroundColor="bg-white"
                                    borderColor="border-gray-300"
                                    textColor="text-gray-900"
                                    focusBorderColor="focus:border-black"
                                    focusRingColor="focus:ring-black/10"
                                />

                                {/* Graduation Status */}
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
                                        focusRingColor="focus:ring-black/10"
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
                                        focusRingColor="focus:ring-black/10"
                                    />
                                )}
                            </>
                        )}

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
                            focusRingColor="focus:ring-black/10"
                        />

                        <div className="md:col-span-2">
                            <TextareaComponent1
                                name="bio"
                                label="Bio/About Me"
                                useFormik={true}
                                rows={4}
                                maxLength={2000}
                                showCharCount={true}
                                placeholder="Tell us about yourself, your achievements, current work, etc..."
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/10"
                                resize="resize-none"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3 justify-end">
                        <BlackButton
                            variant="outline"
                            size="sm"
                            onClick={onCancel}
                            disabled={isSubmitting || isLoading}
                        >
                            Cancel
                        </BlackButton>
                        <BlackButton
                            type="submit"
                            size="sm"
                            loading={isSubmitting || isLoading}
                            disabled={isSubmitting || isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Save Changes'}
                        </BlackButton>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default BasicInfoForm

