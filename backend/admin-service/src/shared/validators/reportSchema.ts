import Joi from "joi";


export const reportSchema = Joi.object({
    userId: Joi.string().trim().required(),
    reportType: Joi.string().valid('Event Fraud', 'Abuse', 'Spam', 'Harassment', 'Fake Profile').required(),
    reportedBy: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    evidence: Joi.string().uri().optional(),
    status: Joi.string().valid('Pending', 'Reviewed', 'Action Taken', 'Dismissed').optional(),
})