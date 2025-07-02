import Joi from "joi";

export const createCategory = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim(),
    image: Joi.string().uri().required()
})