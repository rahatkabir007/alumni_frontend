"use client"
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import InputComponent1 from '@/components/common/InputComponent1'
import TextareaComponent1 from '@/components/common/TextareaComponent1'
import SelectComponent1 from '@/components/common/SelectComponent1'
import BlackButton from '@/components/common/BlackButton'

const ProfileSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .test('no-harmful-chars', 'Name contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        })
        .required('Name is required'),
    phone: Yup.string()
        .max(20, 'Phone number cannot exceed 20 characters')
        .matches(/^[\d\s\-\(\)\+]*$/, 'Phone number contains invalid characters'),
    location: Yup.string()
        .max(500, 'Location cannot exceed 500 characters')
        .test('no-harmful-chars', 'Location contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),
    blood_group: Yup.string()
        .max(3, 'Blood group cannot exceed 3 characters')
        .test('no-harmful-chars', 'Blood group contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),
    graduationYear: Yup.number()
        .min(1998, 'Graduation year must be after 1998')
        .max(new Date().getFullYear() + 10, `Graduation year cannot exceed ${new Date().getFullYear() + 10}`)
        .nullable()
        .transform((value, originalValue) => {
            return originalValue === '' ? null : value;
        }),
    batch: Yup.string()
        .max(100, 'Batch cannot exceed 100 characters')
        .test('no-harmful-chars', 'Batch contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),
    bio: Yup.string()
        .max(2000, 'Bio cannot exceed 2000 characters')
        .test('no-harmful-chars', 'Bio contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),
    joinedYear: Yup.number()
        .min(1998, 'Joined year must be after 1998')
        .max(new Date().getFullYear(), `Joined year cannot exceed ${new Date().getFullYear()}`)
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),
    isGraduated: Yup.boolean(),
    leftAt: Yup.number()
        .min(1998, 'Left at year must be after 1998')
        .max(new Date().getFullYear(), `Left at year cannot exceed ${new Date().getFullYear()}`)
        .nullable()
        .transform((value, originalValue) => {
            return originalValue === '' ? null : value;
        })
        .when('isGraduated', {
            is: false,
            then: (schema) => schema.required('Left at year is required when not graduated'),
            otherwise: (schema) => schema.nullable()
        })
});

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
                joinedYear: userData.joinedYear || userData.joined_year || ''
            }}
            validationSchema={ProfileSchema}
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
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                        />

                        <SelectComponent1
                            name={"branch"}
                            label="Branch"
                            placeholder="Select your branch"
                            options={[
                                { value: 'Jamalkhan', label: 'Jamalkhan' },
                                { value: 'Patiya', label: 'Patiya' },
                            ]}
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
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                        />

                        <InputComponent1
                            name="blood_group"
                            label="Blood Group"
                            placeholder="Your blood group"
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
                                        Education Status
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
                            label="Joined at"
                            placeholder="Year you joined"
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
