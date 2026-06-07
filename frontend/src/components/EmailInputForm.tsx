import {useForm, type SubmitHandler} from "react-hook-form"
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod'
import { useState } from "react";

const inputSchema = z.object({
    email: z.email({message: "invalid email"}),
});

const EmailInputForm = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<{email: string}>({
        resolver: zodResolver(inputSchema),
    })

    const onSubmit: SubmitHandler<{email: string}> = async (data: {email: string}) => {
        try {
            console.log(data);
            const api_url = `${import.meta.env.VITE_API_URL}/api/auth/forget-password`;
            const res = await fetch(api_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const res_data = await res.json();

            if (!res.ok) {
                throw new Error(res_data?.message || "Something Unexpected happened")
            }

            setSuccessMessage(res_data?.message);

        } catch(error) {
            setErrorMessage((error as {message: string}).message)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">email: </label>
                <input type="email" {...register("email", {required: true})} aria-invalid={errors.email ? true : false}  id="email" />
                {
                    errors.email?.type === 'required' && <p role="alert">email is required</p>
                }
                {
                    errors.email && <p role="alert">{errors.email.message}</p>
                }

                <input type="submit" value="send" />
            </form>
            {
                errorMessage && <p>{errorMessage}</p>
            }
            {
                successMessage && <p>{successMessage}</p>
            }
        </div>
    )
}

export default EmailInputForm;