import React, { useState } from 'react';
import { Send, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import * as Yup from 'yup';
import { OrganizerSideBar } from '../../components/partials/OrganizerSidebar';
import type { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import type { FeatureRequestFormData } from '../../interfaces/entities/FormState';
import type { FeatureFormErrors } from '../../interfaces/entities/ErrorState';
import { validateForm, validationSchema } from '../../interfaces/validators/featureFormValidator';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const FeatureRequestPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [formData, setFormData] = useState<FeatureRequestFormData>({
        featureTitle: '',
        category: '',
        priority: 'medium',
        description: '',
        useCase: '',
        additionalInfo: ''
    });

    const [errors, setErrors] = useState<FeatureFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };
    
    const categories = [
        { value: 'booking', label: 'Booking Management' },
        { value: 'payment', label: 'Payment & Billing' },
        { value: 'calendar', label: 'Calendar & Scheduling' },
        { value: 'communication', label: 'Communication' },
        { value: 'reporting', label: 'Analytics & Reporting' },
        { value: 'integration', label: 'Third-party Integration' },
        { value: 'mobile', label: 'Mobile Experience' },
        { value: 'accessibility', label: 'Accessibility' },
        { value: 'other', label: 'Other' }
    ];

    const priorities = [
        { value: 'low', label: 'Low - Nice to have', color: 'text-green-600' },
        { value: 'medium', label: 'Medium - Would improve workflow', color: 'text-yellow-600' },
        { value: 'high', label: 'High - Important for business', color: 'text-orange-600' },
        { value: 'critical', label: 'Critical - Blocking current operations', color: 'text-red-600' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateField = async (fieldName: string, value: string) => {
        try {
            const tempData = { ...formData, [fieldName]: value };
            await validationSchema.validateAt(fieldName, tempData);
            setErrors(prev => ({ ...prev, [fieldName]: '' }));
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setErrors(prev => ({ ...prev, [fieldName]: error.message }));
            }
        }
    };

    const handleSubmit = async () => {
        const isValid = await validateForm(formData, setErrors);
        console.log(isValid)
        if (!isValid) {
            console.log("Not valid")
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await axiosInstance.post(`/admin/request`, formData);
            if (res.data) {
                setIsSubmitted(true);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Submission error:', error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            featureTitle: '',
            category: '',
            priority: 'medium',
            description: '',
            useCase: '',
            additionalInfo: ''
        });
        setErrors({});
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (
            <div className="flex h-screen bg-gray-50">
                <OrganizerSideBar sidebarCollapsed={sidebarCollapsed} section='request a feature' />
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        <AdminNavbar title='Feature Request' user={user} toggleSidebar={toggleSidebar} />
                        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
                                <p className="text-gray-600 mb-6">
                                    Thank you for your feature request. Our team will review it and get back to you within 3-5 business days.
                                </p>
                                <button
                                    onClick={resetForm}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                    Submit Another Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <OrganizerSideBar sidebarCollapsed={sidebarCollapsed} section='request a feature' />
            <div className="flex-1 overflow-auto mt-5">
                <AdminNavbar title='Request for feature' user={user} toggleSidebar={toggleSidebar} />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lightbulb className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Feature Request</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Help us improve our event booking platform by sharing your ideas and suggestions.
                                Your feedback drives our development roadmap.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="space-y-6">

                                <div>
                                    <label htmlFor="featureTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                        Feature Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="featureTitle"
                                        name="featureTitle"
                                        value={formData.featureTitle}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.featureTitle ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Give your feature request a clear, concise title"
                                    />
                                    {errors.featureTitle && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.featureTitle}
                                        </p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.category ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.category}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority Level
                                        </label>
                                        <select
                                            id="priority"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        >
                                            {priorities.map(priority => (
                                                <option key={priority.value} value={priority.value}>{priority.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Feature Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Describe the feature you'd like to see. What should it do? How should it work?"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-2">
                                        Use Case / Problem Statement *
                                    </label>
                                    <textarea
                                        id="useCase"
                                        name="useCase"
                                        value={formData.useCase}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${errors.useCase ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="What problem does this feature solve? How would you use it in your workflow?"
                                    />
                                    {errors.useCase && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.useCase}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Information
                                    </label>
                                    <textarea
                                        id="additionalInfo"
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                        placeholder="Any additional context, mockups, or references that might help us understand your request better"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        ) : (
                                            <Send className="w-5 h-5 mr-2" />
                                        )}
                                        {isSubmitting ? 'Submitting Request...' : 'Submit Feature Request'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="mt-8 text-center text-sm text-gray-600">
                            <p>
                                Questions about this form? Contact our support team at{' '}
                                <a href="mailto:support@eventbooking.com" className="text-blue-600 hover:underline">
                                    support@eventbooking.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureRequestPage;