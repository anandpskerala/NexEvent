import * as Yup from 'yup'
import type { CategoryFormData } from '../entities/FormState';

const schema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  icon: Yup.mixed()
    .required("A file is required")
});

export const validateCategory = async (data: CategoryFormData) => {
    await schema.validate(data, {abortEarly: false});
}