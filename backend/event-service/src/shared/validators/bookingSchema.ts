import Joi from "joi";

const paymentMethods = ['razorpay', 'stripe', 'wallet'] as const;
const bookingStatuses = ['pending', 'paid', 'failed', 'cancelled'] as const;

export const bookingSchema = Joi.object({
    eventId: Joi.string().required(),
    paymentId: Joi.string().optional().allow(''),
    orderId: Joi.string().optional().allow(''),
    tickets: Joi.array()
        .items(
            Joi.object({
                ticketId: Joi.string().required(),
                quantity: Joi.number().integer().positive().required(),
                name: Joi.string().required(),
                price: Joi.number().precision(2).min(0).required(),
            })
        )
        .min(1)
        .required(),

    totalAmount: Joi.number().required(),
    paymentMethod: Joi.string()
        .valid(...paymentMethods, null)
        .required(),
    status: Joi.string().valid(...bookingStatuses).optional(),
    couponCode: Joi.string().optional().allow(''),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
});

export const failedBookingSchema = Joi.object({
    eventId: Joi.string().required(),
    bookingId: Joi.string().required(),
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    status: Joi.string().optional()
})
