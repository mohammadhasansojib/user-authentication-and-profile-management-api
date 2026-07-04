import { useEffect, useState } from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useSearchParams } from "react-router";


const Reset = () => {
    const [searchParams] = useSearchParams();
    const [showForm, setShowForm] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const token = searchParams.get('token') ?? "my-token";

    useEffect(() => {
        const sendRequest = async () => {
            try {
                const api_url = `${import.meta.env.VITE_API_URL}/api/auth/reset-password?token=${token}`;
                
                const res = await fetch(api_url, {
                    method: "POST",
                });
                const res_data = await res.json();

                if (!res.ok) {
                    console.log(res_data);
                    throw new Error(res_data.message);
                }

                setShowForm(true);

            } catch (error) {
                setErrorMessage((error as {message: string}).message)
            }
        }

        sendRequest();
    })


    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-slate-100 tracking-tight mb-8">Reset password</h1>
                { !showForm && !errorMessage && (
                    <p className="text-sm text-slate-400">Verifying your reset link…</p>
                )}
                { showForm && <ResetPasswordForm token={token} />}
                {
                    errorMessage && (
                        <p className="rounded-lg border border-red-900 bg-red-950/50 px-3.5 py-2.5 text-sm text-red-400">{errorMessage}</p>
                    )
                }
            </div>
        </div>
    )
}

export default Reset;