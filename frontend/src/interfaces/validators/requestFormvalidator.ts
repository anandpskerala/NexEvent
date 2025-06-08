import * as Yup from 'yup'
import type { OrganizerFormState } from '../entities/FormState';

const schema = Yup.object().shape({
    phoneNumber: Yup.string().trim().required("Phone number is required"),
    organization: Yup.string().trim().required("Organization name is required"),
    website: Yup.string().trim().url("Must be a valid URL").notRequired(),
    reason: Yup.string().trim().required("Reason is required"),
    accepted: Yup.bool().oneOf([true], "You must agree to terms"),
    documents: Yup.mixed().required("A file is required")
});

export const validateRequestForm = async (data: OrganizerFormState) => {
    await schema.validate(data, {abortEarly: false});
}