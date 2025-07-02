import Joi from "joi";

export const createCoupon = Joi.object({
    couponCode: Joi.string().trim().max(25).required(),
    couponName: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    discount: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    minAmount: Joi.number().required(),
    maxAmount: Joi.number().required(),
    status: Joi.optional()
})