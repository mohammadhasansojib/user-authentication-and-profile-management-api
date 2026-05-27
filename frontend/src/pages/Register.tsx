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
        <div onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h1>Register</h1>

                <form>
                    <div>
                        <label htmlFor="email">email: </label>
                        <input type="email" {...register("email")} id="email" aria-invalid={errors.email ? "true" : "false"} />
                        {
                            errors.email && <span role="alert">{errors.email.message}</span>
                        }
                    </div>

                    <div>
                        <label htmlFor="name">name: </label>
                        <input type="name" {...register("name")} id="name" aria-invalid={errors.name ? "true" : "false"} />
                        {
                            errors.name && <span role="alert">{errors.name.message}</span>
                        }
                    </div>

                    <div>
                        <label htmlFor="password">password: </label>
                        <input type="password" {...register("password")} id="password" aria-invalid={errors.password ? "true" : "false"} />
                        {
                            errors.password && <span role="alert">{errors.password.message}</span>
                        }
                    </div>

                    <input type="submit" value="register" />
                </form>
                {
                    error && <span>{error}</span>
                }
            </div>
        </div>
    )
}



export default Register;