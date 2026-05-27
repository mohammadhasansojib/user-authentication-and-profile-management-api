import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

                // console.log(data);
                console.log(res);
                console.log(res_data);
                navigate('/dashboard');
                
            } catch (error) {
                setErrorMessage(`${(error as {message: string}).message}`);
            }
        }

        sendData();
    }



    return (
        <div>
            <div>
                <h1>Login</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email">Email: </label>
                        <input type="email" {...register("email")} id="email" aria-invalid={errors.email ? "true" : "false"} />
                        {
                            errors.email && <span role="alert">{errors.email.message}</span>
                        }
                    </div>

                    <div>
                        <label htmlFor="password">Password: </label>
                        <input type="password" {...register("password")} id="password" aria-invalid={errors.password ? "true" : "false"} />
                        {
                            errors.password && <span role="alert">{errors.password.message}</span>
                        }
                    </div>

                    <input type="submit" value="login" />
                </form>
                {
                    errorMessage && <span>{errorMessage}</span>
                }
            </div>
        </div>
    )
}


export default Login;