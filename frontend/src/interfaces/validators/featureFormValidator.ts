import * as Yup from 'yup';
import type { FeatureRequestFormData } from '../entities/FormState';
import type { FeatureFormErrors } from '../entities/ErrorState';

export const validationSchema = Yup.object().shape({
    featureTitle: Yup.string()
        .required('Feature title is required')
        .min(5, 'Feature title must be at least 5 characters')
        .max(100, 'Feature title must be less than 100 characters'),
    category: Yup.string()
        .required('Please select a category'),
    priority: Yup.string()
        .required('Priority is required')
        .oneOf(['low', 'medium', 'high', 'critical'], 'Invalid priority level'),
    description: Yup.string()
        .required('Feature description is required')
        .min(20, 'Please provide a more detailed description (at least 20 characters)')
        .max(1000, 'Description must be less than 1000 characters'),
    useCase: Yup.string()
        .required('Use case is required')
        .min(10, 'Use case must be at least 10 characters')
        .max(500, 'Use case must be less than 500 characters'),
    additionalInfo: Yup.string()
        .max(500, 'Additional information must be less than 500 characters')
});


export const validateForm = async (formData: FeatureRequestFormData, setErrors: React.Dispatch<React.SetStateAction<FeatureFormErrors>>): Promise<boolean> => {
    try {
        await validationSchema.validate(formData, { abortEarly: false });
        setErrors({});
        return true;
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            const newErrors: FeatureFormErrors = {};
            error.inner.forEach((err) => {
                console.log(err)
                if (err.path) {
                    newErrors[err.path] = err.message;
                }
            });
        }
        console.log(error)
        return false;
    }
};