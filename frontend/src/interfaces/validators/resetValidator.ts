import * as Yup from "yup"
import type { ResetFormState } from "../entities/FormState";

const schema = Yup.object({
    password: Yup.string().trim().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup
        .string().trim()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Please confirm your password"),
});

export const validateResetForm = async (data: ResetFormState) => {
    await schema.validate(data, {abortEarly: false});
}