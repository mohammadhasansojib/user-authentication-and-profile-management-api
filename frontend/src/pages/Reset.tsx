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
        <div>
            <h1>Reset</h1>
            { showForm && <ResetPasswordForm token={token} />}
            {
                errorMessage && <p>{errorMessage}</p>
            }
        </div>
    )
}

export default Reset;