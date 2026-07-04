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
        <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                    <input
                        type="email"
                        {...register("email", {required: true})}
                        aria-invalid={errors.email ? true : false}
                        id="email"
                        placeholder="you@example.com"
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500"
                    />
                    {
                        errors.email?.type === 'required' && <p role="alert" className="mt-1.5 text-xs text-red-400">email is required</p>
                    }
                    {
                        errors.email && <p role="alert" className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
                    }
                </div>

                <input
                    type="submit"
                    value="Send"
                    className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-slate-950 cursor-pointer transition-colors hover:bg-emerald-400 active:bg-emerald-600"
                />
            </form>
            {
                errorMessage && <p className="mt-4 rounded-lg border border-red-900 bg-red-950/50 px-3.5 py-2.5 text-sm text-red-400">{errorMessage}</p>
            }
            {
                successMessage && <p className="mt-4 rounded-lg border border-emerald-900 bg-emerald-950/50 px-3.5 py-2.5 text-sm text-emerald-400">{successMessage}</p>
            }
        </div>
    )
}

export default EmailInputForm;