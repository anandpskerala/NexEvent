import * as Yup from 'yup';
import type { ICoupon } from '../entities/Coupons';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const getCouponValidationSchema = (
  isEdit = false,
  initialStartDate?: Date,
) => {
  return Yup.object().shape({
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
      .typeError('Invalid Start Date')
      .when([], {
        is: () => true,
        then: (schema: Yup.DateSchema<Date | undefined>) =>
          isEdit && initialStartDate
            ? schema.min(initialStartDate, 'Start Date cannot be earlier than original Start Date')
            : schema.min(today, 'Start Date must be today or in the future'),
      }),

    endDate: Yup.date()
      .required('End Date is required')
      .typeError('Invalid End Date')
      .when('startDate', {
        is: (startDate: Date) => !!startDate,
        then: (schema) =>
          schema.min(today, 'End Date must be today or in the future')
            .min(Yup.ref('startDate'), 'End Date must be after Start Date'),
      }),


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
};

export const validateCoupon = async (
  data: Partial<ICoupon>,
  isEdit = false,
  initialStartDate?: Date,
) => {
  const schema = getCouponValidationSchema(isEdit, initialStartDate);
  await schema.validate(data, { abortEarly: false });
};
