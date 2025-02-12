import classNames from 'classnames'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import isLastChild from '@/utils/isLastChild'
import {
    HiOutlineDesktopComputer,
    HiOutlineDeviceMobile,
    HiOutlineDeviceTablet,
} from 'react-icons/hi'
import dayjs from 'dayjs'
import * as Yup from 'yup'
import {
    apiChangePasswordByEmail,
    apiGetCurUserProfile,
} from '@/services/UserApi'
import { apiCheckPassword } from '@/services/AuthService'
import { useEffect, useState } from 'react'
import { PasswordInput } from '@/components/shared'

type LoginHistory = {
    type: string
    deviceName: string
    time: number
    location: string
}

type PasswordFormModel = {
    password: string
    newPassword: string
    confirmNewPassword: string
}

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Password Required'),
    newPassword: Yup.string()
        .required('Enter your new password')
        .matches(/^[A-Za-z0-9_-]*$/, 'Only Letters & Numbers Allowed'),
    confirmNewPassword: Yup.string()
        .required('Enter your confirm password')
        .oneOf([Yup.ref('newPassword'), ''], 'Password not match'),
})

const Password = () => {
    const [apiData, setApiData] = useState<any>({})

    useEffect(() => {
        async function fetchData() {
            const resData = (await apiGetCurUserProfile()) as any
            setApiData(resData.data.data)
            console.log(resData.data.data)
        }
        fetchData()
    }, [])

    const onFormSubmit = async (
        values: PasswordFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const isChecked = (await apiCheckPassword({
            enteredPassword: values.password,
            userPassword: apiData.password,
        })) as any

        if (isChecked.data?.data === false) {
            toast.push(
                <Notification title={'Invalid credentials'} type="danger" />,
                {
                    placement: 'top-center',
                }
            )
            setSubmitting(false)
            return false
        }

        const res = (await apiChangePasswordByEmail(
            apiData.email,
            values.confirmNewPassword
        )) as any

        if (res.data?.success) {
            toast.push(
                <Notification title={'Password updated'} type="success" />,
                {
                    placement: 'top-center',
                }
            )
        } else {
            toast.push(
                <Notification
                    title={'Error while updating password'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }

        setSubmitting(false)
        console.log('values', values)
    }

    return (
        <>
            <Formik
                initialValues={{
                    password: '',
                    newPassword: '',
                    confirmNewPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onFormSubmit(values, setSubmitting)
                }}
            >
                {({ touched, errors, isSubmitting, resetForm }) => {
                    const validatorProps = { touched, errors }
                    return (
                        <Form>
                            <FormContainer>
                                <FormDesription
                                    title="Password"
                                    desc="Enter your current & new password to reset your password"
                                />
                                <FormRow
                                    name="password"
                                    label="Current Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        autoComplete="off"
                                        name="password"
                                        placeholder="Current Password"
                                        component={PasswordInput}
                                    />
                                </FormRow>
                                <FormRow
                                    name="newPassword"
                                    label="New Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        autoComplete="off"
                                        name="newPassword"
                                        placeholder="New Password"
                                        component={PasswordInput}
                                    />
                                </FormRow>
                                <FormRow
                                    name="confirmNewPassword"
                                    label="Confirm Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        autoComplete="off"
                                        name="confirmNewPassword"
                                        placeholder="Confirm Password"
                                        component={PasswordInput}
                                    />
                                </FormRow>
                                <div className="flex gap-4 flex-col xs:flex-row mt-4 ltr:text-right">
                                    <Button
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'Updating'
                                            : 'Update Password'}
                                    </Button>
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                        onClick={() => resetForm()}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
            {/* <div className="mt-6">
                <FormDesription
                    title="Where you're signed in"
                    desc="You're signed in to your account on these devices."
                />
                {data && (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-600 mt-6">
                        {data.map((log, index) => (
                            <div
                                key={log.deviceName}
                                className={classNames(
                                    'flex items-center px-4 py-6',
                                    !isLastChild(data, index) &&
                                        'border-b border-gray-200 dark:border-gray-600'
                                )}
                            >
                                <div className="flex items-center">
                                    <div className="text-3xl">
                                        <LoginHistoryIcon type={log.type} />
                                    </div>
                                    <div className="ml-3 rtl:mr-3">
                                        <div className="flex items-center">
                                            <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                {log.deviceName}
                                            </div>
                                            {index === 0 && (
                                                <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0 mx-2">
                                                    <span className="capitalize">
                                                        {' '}
                                                        Current{' '}
                                                    </span>
                                                </Tag>
                                            )}
                                        </div>
                                        <span>
                                            {log.location} •{' '}
                                            {dayjs
                                                .unix(log.time)
                                                .format('DD-MMM-YYYY, hh:mm A')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div> */}
        </>
    )
}

export default Password
