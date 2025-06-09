import { useState } from 'react'
import { NavBar } from '../../components/partials/NavBar'
import * as Yup from "yup"
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Footer } from '../../components/partials/Footer';
import { PasswordInput } from '../../components/partials/PasswordInput'
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { ResetFormState } from '../../interfaces/entities/FormState';
import type { ResetErrorState } from '../../interfaces/entities/ErrorState';
import { validateResetForm } from '../../interfaces/validators/resetValidator';


const ResetPassword = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [formdata, setFormdata] = useState<ResetFormState>({
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<ResetErrorState>({});

    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type == "checkbox") {
            setFormdata({ ...formdata, [e.target.name]: e.target.checked });
        } else {
            setFormdata({ ...formdata, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await validateResetForm(formdata);
            const response = await axiosInstance.patch("/auth/reset-password", { requestId: id, newPassword: formdata.password });
            if (response.data) {
                toast.success(response.data.message);
                navigate("/login");
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errorMap: ResetErrorState = {};
                error.inner.forEach(e => {
                    if (e.path) errorMap[e.path] = e.message;
                });
                setErrors(errorMap);
            }
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavBar isLogged={user?.isVerified} name={`${user?.firstName}`} />
            <div className="flex-1 flex items-center justify-center p-0 md:p-4 mt-25">
                <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-full md:max-w-lg border-1 border-gray-300">
                    <h1 className="text-2xl font-bold text-center mb-4">Create New Password</h1>

                    <p className="text-center text-gray-600 mb-6 px-6">
                        Your new password must be different from previous used passwords.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mt-12">
                            <PasswordInput name="password" label="New Password" errors={errors} handleForm={handleForm} />
                        </div>

                        <div className="mb-4">
                            <PasswordInput name="confirmPassword" label="Confirm Password" errors={errors} handleForm={handleForm} />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-5"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ResetPassword;