import * as Yup from 'yup'
import type { LoginFormState } from '../entities/FormState';

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),

    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(32, 'Password must be less than 32 characters')
        .required('Password is required'),
})

export const validateLogin = async (data: LoginFormState) => {
    await loginSchema.validate(data, {abortEarly: false});
}