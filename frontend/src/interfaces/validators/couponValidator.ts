import * as Yup from 'yup';
import type { ICoupon } from '../entities/Coupons';

export const couponValidationSchema = Yup.object().shape({
  couponCode: Yup.string()
    .trim()
    .required('Coupon Code is required')
    .matches(/^[A-Z0-9-_]+$/, 'Coupon Code can only contain uppercase letters, numbers, hyphens, and underscores'),

  couponName: Yup.string()
    .trim()
    .required('Coupon Name is required'),

  description: Yup.string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters'),

  discount: Yup.number()
    .required('Discount is required')
    .min(1, 'Discount must be at least 1'),

  startDate: Yup.date()
    .required('Start Date is required')
    .typeError('Invalid Start Date'),

  endDate: Yup.date()
    .required('End Date is required')
    .min(Yup.ref('startDate'), 'End Date must be after Start Date')
    .typeError('Invalid End Date'),

  minAmount: Yup.number()
    .min(0, 'Minimum Amount must be 0 or more'),

  maxAmount: Yup.number()
    .min(0, 'Maximum Amount must be 0 or more')
    .test(
      'max-greater-than-min',
      'Maximum Amount must be greater than Minimum Amount',
      function (value) {
        const { minAmount } = this.parent;
        if (value === 0) return true;
        return value as number >= minAmount;
      }
    ),

  status: Yup.string()
    .optional()
    .oneOf(['active', 'inactive', 'expired', ''], 'Invalid status'),
});

export const validateCoupon = async (data: Partial<ICoupon>) => {
    await couponValidationSchema.validate(data, {abortEarly: false});
}