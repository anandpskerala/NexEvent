import { Folder, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react'
import * as Yup from 'yup'
import { uploadToCloudinary } from '../../utils/cloudinary';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import type { CategoryFormProps } from '../../interfaces/props/formProps';
import type { CategoryFormData } from '../../interfaces/entities/FormState';
import type { CategoryErrorState } from '../../interfaces/entities/ErrorState';
import { validateCategory } from '../../interfaces/validators/categoryValidator';


export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, isEditMode = false }) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    icon: initialData?.image || null
  });

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image || null);
  const [errors, setErrors] = useState<CategoryErrorState>({});
  const [isloading, setLoading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: CategoryFormData) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFormData((prev: CategoryFormData) => ({ ...prev, icon: file }));

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setFormData((prev: CategoryFormData) => ({ ...prev, icon: null }));
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await validateCategory(formData);
      let image = initialData?.image || '';

      if (formData.icon && formData.icon instanceof File) {
        image = await uploadToCloudinary(formData.icon);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        image,
      };

      const endpoint = isEditMode
        ? `/admin/category/${initialData?.id}`
        : '/admin/category';

      const method = isEditMode ? axiosInstance.patch : axiosInstance.post;

      const res = await method(endpoint, payload);
      if (res.data) {
        toast.success(res.data.message);
        navigate(-1);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMap: CategoryErrorState = {};
        error.inner.forEach(e => {
          if (e.path) errorMap[e.path] = e.message;
        });
        setErrors(errorMap);
      }

      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      icon: null
    })
    navigate(-1)
  };


  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-sm">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mr-4">
          <Folder className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-md md:text-2xl font-bold text-gray-800">{!isEditMode ? 'Create' : 'Edit'} Category</h1>
      </div>

      <div className="space-y-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            className={`w-full px-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe this category"
            rows={4}
            className={`w-full px-4 py-3 bg-gray-50 border ${errors.description ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Icon
          </label>
          <div
            className={`relative border-2 border-dashed rounded-lg ${dragActive ? 'border-indigo-500 bg-indigo-50' : previewUrl ? 'border-gray-200 bg-indigo-200' : 'border-gray-200 bg-indigo-50'} 
              transition-all duration-200 p-8 flex flex-col items-center justify-center cursor-pointer`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('icon-upload')?.click()}
            style={{ minHeight: '180px' }}
          >
            {previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Category icon preview"
                  className="max-h-40 max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute cursor-pointer -top-3 -right-3 bg-red-100 text-red-500 p-1 rounded-full hover:bg-red-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="mb-4 p-4 bg-indigo-50 rounded-full">
                  <Upload className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Drag & drop your image here
                </p>
                <p className="text-xs text-gray-500">
                  or click to browse files (PNG, JPG, SVG)
                </p>
              </div>
            )}
            <input
            ref={fileRef}
              type="file"
              id="icon-upload"
              onChange={handleFileInput}
              className="hidden"
              accept="image/*"
            />
          </div>
          {errors.icon && (
            <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 flex items-center ${isloading ? 'cursor-not-allowed bg-indigo-700': 'cursor-pointer bg-indigo-600'}`}
            disabled={isloading}
          >
            <span>{isEditMode ? (isloading ? 'Saving': 'Save') : (isloading ? 'Creating': 'Create')} Category {isloading && '...' }</span>
          </button>
        </div>
      </div>
    </div>
  )
}