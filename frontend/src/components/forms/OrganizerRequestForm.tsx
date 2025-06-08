import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import axiosInstance from '../../utils/axiosInstance'
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Folder } from 'lucide-react';
import { uploadToCloudinary } from '../../utils/cloudinary'
import type { OrganizerFormState } from '../../interfaces/entities/FormState'
import type { RequestFormProps } from '../../interfaces/props/formProps'
import type { RequestErrorState } from '../../interfaces/entities/ErrorState'
import { validateRequestForm } from '../../interfaces/validators/requestFormvalidator';

export const OrganizerRequestForm: React.FC<RequestFormProps> = ({userId}) => {
    const navigate = useNavigate();
    const [organizerData, setOrganizerData] = useState<OrganizerFormState>({
        phoneNumber: "",
        organization: "",
        website: "",
        reason: "",
        documents: null,
        accepted: false
    });
    const [errors, setErrors] = useState<RequestErrorState>({});
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
    
            if (e.type === 'dragenter' || e.type === 'dragover') {
                setDragActive(true);
            } else if (e.type === 'dragleave') {
                setDragActive(false);
            }
        };
    
        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
    
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
            }
        };
    
        const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        };
    
        const handleFile = (file: File) => {
            setOrganizerData((prev: OrganizerFormState) => ({ ...prev, documents: file }));
    
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        };

    const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, type, value } = e.target;

        setOrganizerData({ ...organizerData, [id]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        try {
            await validateRequestForm(organizerData);
            if (organizerData.documents) {
                const image = await uploadToCloudinary(organizerData.documents);
                const res = await axiosInstance.post(`/user/request/${userId}`, {...organizerData, documents: image});
            if (res.data) {
                toast.success(res.data.message);
                navigate("/account/profile");
            }
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message);
            } else if (error instanceof Yup.ValidationError) {
                const errorMap: RequestErrorState = {};
                error.inner.forEach(e => {
                    if (e.path) errorMap[e.path] = e.message;
                });
                setErrors(errorMap);
            }
            console.error(error)
        }
    }
    return (
        <div className="flex-1 bg-white py-8 px-6 md:px-20 rounded-2xl shadow-xl border-1 border-gray-200">
            <h1 className="text-xl font-bold mb-4">Request Organizer Role</h1>

            <div className="mb-6 bg-blue-50 p-4 rounded-md border-l-4 border-blue-600">
                <h2 className="text-blue-700 font-medium mb-2">Benefits of becoming an organizer:</h2>
                <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Create and manage your own events
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Access to detailed analytics and reporting
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Custom branding for your event pages
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Direct communication with attendees
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Process ticket sales and manage payments
                    </li>
                </ul>
                <p className="text-sm mt-4 text-gray-600">
                    Your request will be reviewed by our team. This typically takes 1-3 business days.
                </p>
            </div>

            <form className="space-y-4" onSubmit={submitForm}>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={organizerData.phoneNumber}
                        onChange={handleForm}
                        required
                    />
                    {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1 text-center">{errors.phoneNumber}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Organization/Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id='organization'
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={organizerData.organization}
                        onChange={handleForm}
                        required
                    />
                    {errors.organization && (
                        <p className="text-red-500 text-sm mt-1 text-center">{errors.organization}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Website/Social Media (Optional)
                    </label>
                    <input
                        id="website"
                        type="url"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="https://example.com"
                        value={organizerData.website}
                        onChange={handleForm}
                    />
                    {errors.website && (
                        <p className="text-red-500 text-sm mt-1 text-center">{errors.website}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Why Do You Want to Become an Organizer? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="reason"
                        className="w-full p-2 border border-gray-300 rounded h-28"
                        placeholder="Tell us about your motivations and goals for organizing events on our platform."
                        value={organizerData.reason}
                        onChange={handleForm}
                        required
                    />
                    {errors.reason && (
                        <p className="text-red-500 text-sm mt-1 text-center">{errors.reason}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Documents to verify your identity
                    </label>
                    <div
                        className={`border-2 border-dotted bg-gray-300 rounded-md p-12 text-center cursor-pointer transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                            }`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('icon-upload')?.click()}
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Category icon preview"
                                className="mx-auto w-full h-full object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center">
                                <Folder className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                    Drag & drop an image or<br />
                                    click to browse
                                </p>
                            </div>
                        )}
                        <input
                            type="file"
                            id="icon-upload"
                            onChange={handleFileInput}
                            className="hidden"
                            accept="image/*"
                        />
                        {errors.documents && (
                            <p className="text-red-500 text-sm mt-1 text-center">{errors.documents}</p>
                        )}
                    </div>
                </div>

                <div className="pt-3">
                    <label className="flex items-start">
                        <input
                            id="accepted"
                            type="checkbox"
                            className="mt-1 cursor-pointer"
                            checked={organizerData.accepted}
                            onChange={handleForm}
                        />
                        <span className="ml-2 text-sm">
                            I agree to the <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a> for organizers and understand my responsibilities if approved.
                        </span>
                    </label>
                    {errors.accepted && (
                        <p className="text-red-500 text-sm mt-1 text-center">{errors.accepted}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Link to="/account/profile" className="px-4 py-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 text-sm">
                        Cancel
                    </Link>
                    <button
                        className={`px-4 py-2 rounded text-white text-sm ${organizerData.accepted ? 'cursor-pointer bg-blue-500 hover:bg-blue-600': 'cursor-not-allowed bg-gray-400'}`}
                        disabled={organizerData.accepted === false}
                    >
                        Submit Application
                    </button>
                </div>
            </form>
        </div>
    )
}