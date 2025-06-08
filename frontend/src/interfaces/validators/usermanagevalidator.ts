import * as Yup from 'yup';
import type { User } from '../entities/user';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  firstName: Yup.string()
    .required('First Name is required'),
  lastName: Yup.string()
    .required("Last Name is required"),
  roles: Yup.array()
    .min(1, "You must select minimum one role")
})

export const validateUser = async (data: User) => {
    await schema.validate(data, {abortEarly: false});
}