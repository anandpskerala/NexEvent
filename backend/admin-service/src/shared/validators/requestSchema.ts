import Joi from "joi";

export const requestSchema = Joi.object({
    featureTitle: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    priority: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    useCase: Joi.string().trim().required(),
    additionalInfo: Joi.string().allow('').optional()
})