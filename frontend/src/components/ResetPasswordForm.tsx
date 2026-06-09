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
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="new_password">New Password:  </label>
            <input type="password" {...register("new_password", {required: true})}  aria-invalid={errors.new_password ? true : false} id="new_password" placeholder="new password here..." />
            {
                errors.new_password?.type === 'required' && <p role="alert">password is required</p>
            }

            <label htmlFor="confirm_password">Confirm Password:  </label>
            <input type="password" {...register("confirm_password", {required: true})}  id="confirm_password" aria-invalid={errors.confirm_password ? true : false} placeholder="confirm password here..." />
            {
                errors.confirm_password?.type === 'required' && <p role="alert">password is required</p>
            }
            {
                errors.confirm_password?.message && <p>{errors.confirm_password.message}</p>
            }

            <input type="submit" value="send" />

            {
                successMessage && <p>{successMessage}</p>
            }
            {
                errorMessage && <p>{errorMessage}</p>
            }
        </form>
    )
}

export default ResetPasswordForm;