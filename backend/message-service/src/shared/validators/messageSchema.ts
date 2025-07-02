import Joi from "joi";

export const messageSchema = Joi.object({
    sender: Joi.string().required(),
    reciever: Joi.string().required(),
    content: Joi.string().required(),
    media: Joi.string().uri().optional()
})