"use client"
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { RequiredInfoSchema } from '@/utils/validationSchemas';
import { alumniTypeOptions, branchOptions, bloodGroupOptions } from '@/utils/formOptions';
import SelectComponent1 from '@/components/common/SelectComponent1';
import InputComponent1 from '@/components/common/InputComponent1';
import { useCompleteUserProfileMutation, useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi';
import { ToastMessage } from '@/utils/ToastMessage';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/features/auth/authSlice';

export default function RequiredInfo({ user }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [triggerGetUser] = useLazyGetCurrentUserQuery();
    const [completeProfile, { isLoading }] = useCompleteUserProfileMutation();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await completeProfile({
                ...values,
                userId: user.id,
            }).unwrap();

            if (response.success) {
                const token = response.data.token
                if (!token) {
                    ToastMessage.notifyError('Missing authentication token');
                    setSubmitting(false)
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                    return;
                }

                localStorage.setItem('token', token);
                setTimeout(async () => {
                    try {
                        const userData = await triggerGetUser().unwrap();

                        if (!userData || !userData.email || !userData.id) {
                            throw new Error('Invalid user data received from server');
                        }

                        dispatch(setCredentials({
                            user: userData,
                            token: token
                        }));

                        ToastMessage.notifySuccess('Profile completed successfully!');
                        setSubmitting(false);
                        setTimeout(() => {
                            router.replace('/');
                        }, 500);

                    } catch (fetchError) {
                        console.error('Auth callback - Failed to fetch user data:', fetchError);
                        localStorage.removeItem('token');

                        const errorMsg = fetchError.status === 401 ?
                            'Session expired. Please try logging in again.' :
                            fetchError.message || 'Failed to load user profile. Please try again.';

                        ToastMessage.notifyError(errorMsg);
                        setTimeout(() => {
                            router.push('/login');
                        }, 3000);
                    }
                }, 1000);
            } else {
                console.error('Profile completion failed:', response.message);
            }
        } catch (error) {
            console.error('Error completing profile:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
            <div className="max-w-lg w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-4 text-center">Complete Your Profile</h2>
                <Formik
                    initialValues={{
                        name: user?.name || '',
                        email: user?.email || '',
                        alumni_type: '',
                        branch: '',
                        phone: '',
                        location: '',
                        blood_group: '',
                        joinedYear: '',
                        batch: '',
                        isGraduated: true,
                        graduationYear: '',
                        leftAt: '',
                    }}
                    validationSchema={RequiredInfoSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form className="space-y-5">
                            <InputComponent1
                                name="name"
                                type="text"
                                label="Full Name"
                                disabled
                                value={user?.name || ''}
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
                            />
                            <InputComponent1
                                name="email"
                                type="email"
                                label="Email Address"
                                disabled
                                value={user?.email || ''}
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
                            />

                            <SelectComponent1
                                name="alumni_type"
                                label="Alumni Type"
                                placeholder="Select your alumni type"
                                options={alumniTypeOptions}
                                required
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="text-gray-400"
                            />
                            <SelectComponent1
                                name="branch"
                                label="Branch"
                                placeholder="Select your branch"
                                options={branchOptions}
                                required
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="text-gray-400"
                            />
                            <InputComponent1
                                name="phone"
                                type="tel"
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                required
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
                            />
                            <InputComponent1
                                name="location"
                                type="text"
                                label="Address"
                                placeholder="Enter your complete address"
                                required
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
                            />
                            <SelectComponent1
                                name="blood_group"
                                label="Blood Group"
                                placeholder="Select your blood group"
                                options={bloodGroupOptions}
                                required
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="text-gray-400"
                            />
                            <InputComponent1
                                name="joinedYear"
                                type="number"
                                label="Year Joined CIHS"
                                placeholder="Year you joined"
                                required
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
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
                                        labelClassName="text-gray-300"
                                        backgroundColor="bg-white/10"
                                        borderColor="border-gray-600"
                                        textColor="text-white"
                                        placeholderColor="placeholder-gray-400"
                                    />

                                    {/* Education Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Education Status <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center space-x-6">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isGraduated"
                                                    checked={values.isGraduated === true}
                                                    onChange={() => setFieldValue('isGraduated', true)}
                                                    className="mr-2 text-white focus:ring-white"
                                                />
                                                <span className="text-sm text-white">Graduated</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isGraduated"
                                                    checked={values.isGraduated === false}
                                                    onChange={() => setFieldValue('isGraduated', false)}
                                                    className="mr-2 text-white focus:ring-white"
                                                />
                                                <span className="text-sm text-white">Left Early</span>
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
                                            labelClassName="text-gray-300"
                                            backgroundColor="bg-white/10"
                                            borderColor="border-gray-600"
                                            textColor="text-white"
                                            placeholderColor="placeholder-gray-400"
                                        />
                                    ) : (
                                        <InputComponent1
                                            name="leftAt"
                                            type="number"
                                            label="Year Left School"
                                            placeholder="Year you left school"
                                            required
                                            useFormik={true}
                                            labelClassName="text-gray-300"
                                            backgroundColor="bg-white/10"
                                            borderColor="border-gray-600"
                                            textColor="text-white"
                                            placeholderColor="placeholder-gray-400"
                                        />
                                    )}
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                            >
                                {isSubmitting || isLoading ? 'Submitting...' : 'Complete Profile'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}