import * as Yup from "yup"
import type { RegisterFormState } from "../entities/FormState";

const schema = Yup.object({
    firstName: Yup.string().trim().required("First name is required"),
    lastName: Yup.string().trim().required("Last name is required"),
    email: Yup.string().trim().email("Invalid email").required("Email is required"),
    password: Yup.string().trim().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup
        .string().trim()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Please confirm your password"),
    accepted: Yup.boolean().oneOf([true], "You must accept the terms"),
});

export const validateSignup = async (data: RegisterFormState) => {
    await schema.validate(data, {abortEarly: false});
}