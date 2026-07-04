import {useForm, type SubmitHandler} from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


interface IResetPasswordData {
    new_password: string,
    confirm_password: string
}

const resetFormSchema = z.object({
    new_password: z.string("minimum 8 character required").min(8),
    confirm_password: z.string("minimum 8 character required").min(8)
}).refine((data) => data.new_password === data.confirm_password, {
    message: "password didn't match",
    path: ["confirm_password"],
});


const ResetPasswordForm = ({token}: {token: string}) => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // const resetToken = "";

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<IResetPasswordData>({
        resolver: zodResolver(resetFormSchema),
    })

    const onSubmit: SubmitHandler<IResetPasswordData> = async (data: IResetPasswordData) => {
        try {
            console.log(data)

            // const api_url = `${import.meta.env.VITE_API_URL}/reset-password?token=${resetToken}`;
            const api_url = `${import.meta.env.VITE_API_URL}/api/auth/reset-password?token=${token}`;


            const res = await fetch(api_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: data.new_password,
                })
            });

            const res_data = await res.json();

            if (!res.ok) {
                throw new Error(res_data.message);
            }

            setSuccessMessage(res_data.message);

            setTimeout(() => navigate("/login"), 2000);


        } catch (error) {
            setErrorMessage((error as {message: string}).message)
        }
    }
    

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-slate-300 mb-1.5">New password</label>
                <input
                    type="password"
                    {...register("new_password", {required: true})}
                    aria-invalid={errors.new_password ? true : false}
                    id="new_password"
                    placeholder="new password here..."
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500"
                />
                {
                    errors.new_password?.type === 'required' && <p role="alert" className="mt-1.5 text-xs text-red-400">password is required</p>
                }
            </div>

            <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-300 mb-1.5">Confirm password</label>
                <input
                    type="password"
                    {...register("confirm_password", {required: true})}
                    id="confirm_password"
                    aria-invalid={errors.confirm_password ? true : false}
                    placeholder="confirm password here..."
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500"
                />
                {
                    errors.confirm_password?.type === 'required' && <p role="alert" className="mt-1.5 text-xs text-red-400">password is required</p>
                }
                {
                    errors.confirm_password?.message && <p className="mt-1.5 text-xs text-red-400">{errors.confirm_password.message}</p>
                }
            </div>

            <input
                type="submit"
                value="Send"
                className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-slate-950 cursor-pointer transition-colors hover:bg-emerald-400 active:bg-emerald-600"
            />

            {
                successMessage && <p className="rounded-lg border border-emerald-900 bg-emerald-950/50 px-3.5 py-2.5 text-sm text-emerald-400">{successMessage}</p>
            }
            {
                errorMessage && <p className="rounded-lg border border-red-900 bg-red-950/50 px-3.5 py-2.5 text-sm text-red-400">{errorMessage}</p>
            }
        </form>
    )
}

export default ResetPasswordForm;