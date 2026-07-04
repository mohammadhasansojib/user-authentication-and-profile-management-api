import EmailInputForm from "../components/EmailInputForm";


const ForgetPassword = () => {



    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-slate-100 tracking-tight mb-1">Forgot your password?</h1>
                <p className="text-sm text-slate-400 mb-8">Enter your email and we'll send you a reset link.</p>
                <EmailInputForm />
            </div>
        </div>
    )
}

export default ForgetPassword;