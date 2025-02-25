import ThemeApply from '@/components/layouts/ThemeApply'
import SignUpForm from './SignUpForm'

const SignUp = () => {
    ThemeApply()

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Sign Up</h3>
                <p>And lets get started with your free trial</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </>
    )
}

export default SignUp
