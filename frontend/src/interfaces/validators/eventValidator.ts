import * as yup from 'yup';
import type { EventData } from '../entities/FormState';

const today = new Date();
today.setHours(0, 0, 0, 0);

const locationSchema = yup.object({
  place: yup.string().when('$eventType', {
    is: 'offline',
    then: (schema) => schema.required('Location is required for offline events'),
    otherwise: (schema) => schema.notRequired(),
  }),
  coordinates: yup.array()
    .of(yup.number().typeError('Coordinates must be numbers'))
    .length(2, 'Coordinates must be an array of two numbers [lng, lat]')
    .when('$eventType', {
      is: 'offline',
      then: (schema) => schema.required('Coordinates are required for offline events'),
      otherwise: (schema) => schema.notRequired(),
    }),
});


const eventValidationSchema = yup.object().shape({
    title: yup.string().trim().required('Event title is required'),
    description: yup.string().trim().required('Event description is required'),
    eventType: yup.string().oneOf(['offline', 'virtual']).required(),
    category: yup.string().trim().required('Category is required'),
    image: yup.mixed().test('fileOrUrl', 'Image must be a file or a URL', (value) => {
        return value === null || typeof value === 'string' || value instanceof File;
    }),
    tags: yup.array().of(yup.string().trim()).min(1, 'At least one tag is required'),
    eventFormat: yup.string().oneOf(['single', 'multiple']).required(),
    location: locationSchema,
    startDate: yup.date()
        .min(today, 'Start date must be today or in the future')
        .required('Start date is required'),
    endDate: yup.date().when('eventFormat', {
        is: 'multiple',
        then: (schema) =>
            schema
                .required('End date is required for multi-day events')
                .test('is-after', 'End date must be after start date', function (value) {
                    const { startDate } = this.parent;
                    return !value || !startDate || new Date(value) >= new Date(startDate);
                }),
        otherwise: (schema) => schema.notRequired(),
    })
    .min(today, 'End date must be today or in the future'),
    startTime: yup.string().required('Start time is required'),
    endTime: yup.string().required('End time is required'),
});

export const validateEvent = async (data: Partial<EventData>) => {
    await eventValidationSchema.validate(data, { abortEarly: false, context: { eventType: data.eventType } });
}