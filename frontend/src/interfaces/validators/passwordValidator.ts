import * as Yup from "yup"
import type { PasswordFormState } from "../entities/FormState";

const schema = Yup.object({
    currentPassword: Yup.string().trim().min(6, "Password must be at least 6 characters").required("Password is required"),
    newPassword: Yup.string().trim().min(6, "Password must be at least 6 characters")
        .notOneOf([Yup.ref('currentPassword')], "New password must be different from current password")
        .required("Password is required"),
    confirmPassword: Yup
        .string().trim()
        .oneOf([Yup.ref("newPassword")], "Passwords do not match")
        .required("Please confirm your password"),
});

export const validatePassword = async (data: PasswordFormState) => {
    await schema.validate(data, {abortEarly: false});
}
