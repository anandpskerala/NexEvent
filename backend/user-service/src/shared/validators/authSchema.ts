import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required()
});


export const signupSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).required()
})


export const googleAuthSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().allow('').optional(),
    email: Joi.string().trim().email().required(),
    googleId: Joi.string().required()
})