import Joi from "joi";

const locationSchema = Joi.object({
    type: Joi.string().allow('').optional(),
    coordinates: Joi.array().items(
        Joi.number().min(-180).max(180),
        Joi.number().min(-90).max(90)
    ).length(2).required(),
    place: Joi.string().optional().allow('')
});

export const ticketSchema = Joi.object({
    id: Joi.string().optional(),
    name: Joi.string().trim().required(),
    type: Joi.string().valid("free", "paid", "donation").required(),
    price: Joi.alternatives().try(Joi.number().min(0), Joi.string()).optional(),
    quantity: Joi.number().integer().min(1).required(),
    description: Joi.string().trim().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref("startDate")).required()
});

export const eventSchema = Joi.object({
    id: Joi.string().allow('').optional(),
    userId: Joi.string().optional(),
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().uri().required(),
    category: Joi.string().required(),
    eventType: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).default([]),
    eventFormat: Joi.string().required(),
    entryType: Joi.string().optional(),
    currency: Joi.string().optional(),
    status: Joi.string().optional(),
    tickets: Joi.array().items(ticketSchema).optional(),
    location: locationSchema.required(),
    showQuantity: Joi.boolean().optional(),
    refunds: Joi.boolean().optional(),
    startDate: Joi.string().isoDate().optional(),
    endDate: Joi.string().isoDate().optional(),
    startTime: Joi.string().optional(),
    endTime: Joi.string().optional()
});

export const editEventSchema = Joi.object({
    id: Joi.string().required(),
    userId: Joi.string().required(),
    title: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    image: Joi.string().uri().optional(),
    category: Joi.string().optional(),
    eventType: Joi.string().optional(),
    eventFormat: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    location: locationSchema.optional(),
    startDate: Joi.string().isoDate().optional(),
    endDate: Joi.string().isoDate().optional(),
    startTime: Joi.string().optional(),
    endTime: Joi.string().optional()
});

export const createTicketSchema = Joi.object({
    id: Joi.string().required(),
    currency: Joi.string().trim().required(),
    entryType: Joi.string().valid("free", "paid", "donation").required(),
    showQuantity: Joi.boolean().required(),
    refunds: Joi.boolean().required(),
    tickets: Joi.array().items(ticketSchema).min(1),
});

export const editTicketSchema = Joi.object({
    id: Joi.string().required(),
    currency: Joi.string().trim().optional(),
    entryType: Joi.string().valid("free", "paid", "donation").optional(),
    showQuantity: Joi.boolean().optional(),
    refunds: Joi.boolean().optional(),
    tickets: Joi.array().items(ticketSchema).min(1).optional()
});