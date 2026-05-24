import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'

const LoginDataSchema = z.object({
    email: z.email("must be a valid email"),
    password: z.string().min(8, "password minimum length 8")
})

interface ILoginFormData {
    email: string,
    password: string,
}

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ILoginFormData>({
        resolver: zodResolver(LoginDataSchema),
    });
    const onSubmit: SubmitHandler<ILoginFormData> = (data: ILoginFormData) => console.log(data);



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
            </div>
        </div>
    )
}

export default Login;