import { useEffect } from 'react'
import SignInForm from './SignInForm'
import ThemeApply from '@/components/layouts/ThemeApply'
import { useAppSelector } from '@/store'
import GoogleLoginButton from '@/components/GoogleLoginButton/GoogleLoginButton'
import { ActionLink } from '@/components/shared'

const SignIn = () => {
    ThemeApply()

    const themeColor = useAppSelector((state) => state.theme.themeBackground)

    return (
        <main className="w-full min-h-[93.5dvh] flex flex-col justify-center">
            <div className="mb-8">
                <h3 className="mb-1">
                    Welcome to the Verifiable Computing Platform!
                </h3>
                <p>Please enter your credentials to sign in.</p>
            </div>
            <SignInForm disableSubmit={false} />
            <section className="w-full relative border-t border-gray-400 my-6">
                <p
                    className={`absolute top-[-11px] left-1/2 transform -translate-x-1/2 px-3 bg-${themeColor}`}
                >
                    Or
                </p>
            </section>
            <div className="flex flex-col gap-4 w-full max-w-[550px]">
                <GoogleLoginButton />
                <p className="text-wrap text-center">
                    By continuing, you agree to Fidesinnova's{' '}
                    <ActionLink
                        target="_blank"
                        to={
                            'https://fidesinnova.io/Download/docs/terms-of-service.html'
                        }
                    >
                        Terms of Service
                    </ActionLink>{' '}
                    and acknowledge you've read our{' '}
                    <ActionLink
                        target="_blank"
                        to={
                            'https://fidesinnova.io/Download/docs/privacy-policy.html'
                        }
                    >
                        Privacy Policy
                    </ActionLink>
                    .
                </p>
            </div>
            <section className="w-full relative my-4">
                <div className="w-5/12 mx-auto border-t border-gray-400"></div>
            </section>
        </main>
    )
}

export default SignIn
