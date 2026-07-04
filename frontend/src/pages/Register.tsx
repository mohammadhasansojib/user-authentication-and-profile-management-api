import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const RegistrationDataSchema = z.object({
    email: z.email().trim(),
    name: z.string().trim().min(3, "name minimum length 3").max(20, "name maximum length 20"),
    password: z.string().min(8, "password minimum length 8")
})

interface IRegistrationFormData {
    email: string,
    name: string,
    password: string,
}

const api_url = import.meta.env.VITE_API_URL;

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<IRegistrationFormData>({
        resolver: zodResolver(RegistrationDataSchema),
    });

    const onSubmit: SubmitHandler<IRegistrationFormData> = (data: IRegistrationFormData) => {

        const sendData = async () => {
            try {
                const res = await fetch(`${api_url}/api/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if(!res.ok){
                    const res_err = await res.json();
                    throw new Error(`${res_err.message}`);
                }

                const res_data = await res.json();
                navigate("/login");

                return res_data;
            } catch (error) {
                setError((error as {message: string}).message);
                console.error(`Error during POST: ${(error as {message: string}).message}`);
            }
        }

        sendData();
    };


    return (
        <div onSubmit={handleSubmit(onSubmit)} className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-slate-100 tracking-tight mb-1">Create your account</h1>
                <p className="text-sm text-slate-400 mb-8">Register with your details to get started.</p>

                <form className="space-y-5">
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
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                        <input
                            type="name"
                            {...register("name")}
                            id="name"
                            aria-invalid={errors.name ? "true" : "false"}
                            placeholder="Jane Doe"
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500"
                        />
                        {
                            errors.name && <span role="alert" className="mt-1.5 block text-xs text-red-400">{errors.name.message}</span>
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
                        value="Register"
                        className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-slate-950 cursor-pointer transition-colors hover:bg-emerald-400 active:bg-emerald-600"
                    />
                </form>
                {
                    error && <span className="mt-4 block rounded-lg border border-red-900 bg-red-950/50 px-3.5 py-2.5 text-sm text-red-400">{error}</span>
                }
            </div>
        </div>
    )
}



export default Register;