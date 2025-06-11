import React, { useState } from 'react'
import * as Yup from 'yup';
import type { CouponFormProps } from '../../interfaces/props/formProps'
import type { ICoupon } from '../../interfaces/entities/Coupons';
import type { CouponErrorState } from '../../interfaces/entities/ErrorState';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { validateCoupon } from '../../interfaces/validators/couponValidator';

export const CouponForm: React.FC<CouponFormProps> = ({ initialData, isEdit }) => {
    const [formData, setFormData] = useState<Partial<ICoupon>>({
        couponCode: initialData?.couponCode || '',
        couponName: initialData?.couponName || '',
        description: initialData?.description || '',
        discount: initialData?.discount || 0,
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        status: initialData?.status || '',
        minAmount: initialData?.minAmount || 0,
        maxAmount: initialData?.maxAmount || 0,
    });
    const navigate = useNavigate();

    const [errors, setErrors] = useState<CouponErrorState>({});
    const [isloading, setLoading] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'discount' || name === 'minAmount' || name === 'maxAmount') {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await validateCoupon(formData);

            const payload = {
                couponCode: formData.couponCode,
                couponName: formData.couponName,
                description: formData.description,
                discount: formData.discount,
                startDate: formData.startDate,
                endDate: formData.endDate,
                status: formData.status,
                minAmount: formData.minAmount,
                maxAmount: formData.maxAmount,
            };

            const endpoint = isEdit
                ? `/admin/coupon/${initialData?.id}`
                : '/admin/coupon';

            const method = isEdit ? axiosInstance.patch : axiosInstance.post;

            const res = await method(endpoint, payload);
            if (res.data) {
                toast.success(res.data.message);
                navigate('/admin/coupons');
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errorMap: CouponErrorState = {};
                error.inner.forEach(e => {
                    if (e.path) errorMap[e.path] = e.message;
                });
                setErrors(errorMap);
            }

            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            couponCode: '',
            couponName: '',
            description: '',
            discount: 0,
            startDate: '',
            endDate: '',
            status: '',
            minAmount: 0,
            maxAmount: 0,
        })
        navigate(-1)
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Create New Coupon</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-2">
                            Coupon Code
                        </label>
                        <input
                            type="text"
                            id="couponCode"
                            name="couponCode"
                            value={formData.couponCode}
                            onChange={handleInputChange}
                            placeholder="e.g., SUMMER2025"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.couponCode && (
                            <p className="mt-1 text-sm text-red-600">{errors.couponCode}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="couponName" className="block text-sm font-medium text-gray-700 mb-2">
                            Coupon Name
                        </label>
                        <input
                            type="text"
                            id="couponName"
                            name="couponName"
                            value={formData.couponName}
                            onChange={handleInputChange}
                            placeholder="e.g., Summer Sale 2025"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.couponName && (
                            <p className="mt-1 text-sm text-red-600">{errors.couponName}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <div>
                        <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Type
                        </label>
                        <select
                            id="discountType"
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="percentage">Percentage Discount</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div> */}

                    <div>
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Value
                        </label>
                        <input
                            type="number"
                            id="discount"
                            name="discount"
                            value={formData.discount}
                            onChange={handleInputChange}
                            placeholder={'e.g., 15 for $15'}
                            min="0"
                            // step={discountType === 'percentage' ? '1' : '0.01'}
                            // max={discountType === 'percentage' ? '100' : undefined}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        {errors.discount && (
                            <p className="mt-1 text-sm text-red-600">{errors.discount}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={
                                formData.startDate
                                    ? new Date(formData.startDate).toISOString().split("T")[0]
                                    : ''
                            }
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        {errors.startDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={
                                formData.endDate
                                    ? new Date(formData.endDate).toISOString().split("T")[0]
                                    : ''
                            }
                            onChange={handleInputChange}
                            required
                            min={formData.startDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        {errors.endDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Purchase Amount ($)
                        </label>
                        <input
                            type="number"
                            id="minAmount"
                            name="minAmount"
                            value={formData.minAmount}
                            onChange={handleInputChange}
                            placeholder="0 for no minimum"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.minAmount && (
                            <p className="mt-1 text-sm text-red-600">{errors.minAmount}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Purchase Amount ($)
                        </label>
                        <input
                            type="number"
                            id="maxAmount"
                            name="maxAmount"
                            value={formData.maxAmount}
                            onChange={handleInputChange}
                            placeholder="0 for unlimited"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.maxAmount && (
                            <p className="mt-1 text-sm text-red-600">{errors.maxAmount}</p>
                        )}
                    </div>
                </div>

                {initialData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="expired">Expired</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>
                        <div></div>
                    </div>
                )}

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter a description for this coupon"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                    >
                        {isEdit ? (isloading ? 'Saving' : 'Save') : (isloading ? 'Creating' : 'Create')} Coupon {isloading && '...'}
                    </button>
                </div>
            </form>
        </div>
    )
}
