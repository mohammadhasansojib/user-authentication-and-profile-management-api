import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const LoginDataSchema = z.object({
    email: z.email("must be a valid email"),
    password: z.string().min(8, "password minimum length 8")
})

interface ILoginFormData {
    email: string,
    password: string,
}

const api_url = import.meta.env.VITE_API_URL;

const Login = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ILoginFormData>({
        resolver: zodResolver(LoginDataSchema),
    });
    const onSubmit: SubmitHandler<ILoginFormData> = (data: ILoginFormData) => {

        const sendData = async () => {
            try {
                const res = await fetch(`${api_url}/api/auth/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    const err_data = await res.json();
                    // console.log(err_data);
                    throw new Error(`${err_data.message}`);
                }

                const res_data = await res.json();
                config.accessToken = res_data.accessToken;

                // console.log(data);
                console.log(res);
                console.log(res_data);
                navigate('/profile');
                
            } catch (error) {
                setErrorMessage(`${(error as {message: string}).message}`);
            }
        }

        sendData();
    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-slate-100 tracking-tight mb-1">Welcome back</h1>
                <p className="text-sm text-slate-400 mb-8">Log in to continue to your account.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            id="email"
                            aria-invalid={errors.email ? "true" : "false"}
                            placeholder="you@example.com"
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500"
                        />
                        {
                            errors.email && <span role="alert" className="mt-1.5 block text-xs text-red-400">{errors.email.message}</span>
                        }
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            id="password"
                            aria-invalid={errors.password ? "true" : "false"}
                            placeholder="••••••••"
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500"
                        />
                        {
                            errors.password && <span role="alert" className="mt-1.5 block text-xs text-red-400">{errors.password.message}</span>
                        }
                    </div>

                    <input
                        type="submit"
                        value="Login"
                        className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-slate-950 cursor-pointer transition-colors hover:bg-emerald-400 active:bg-emerald-600"
                    />
                </form>
                {
                    errorMessage && <span className="mt-4 block rounded-lg border border-red-900 bg-red-950/50 px-3.5 py-2.5 text-sm text-red-400">{errorMessage}</span>
                }
            </div>
        </div>
    )
}


export default Login;