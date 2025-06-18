import React, { useEffect, useRef, useState } from 'react'
import type { UploadStatus, UserReportProps } from '../../interfaces/props/modalProps'
import type { ReportForm } from '../../interfaces/entities/Reports';
import { X, ShieldAlert, AlertCircle, FileImage, Upload, Loader, CheckCircle } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { uploadToCloudinary } from '../../utils/cloudinary';
import axiosInstance from '../../utils/axiosInstance';

export const UserReportModal: React.FC<UserReportProps> = ({
  isOpen,
  onClose,
  userId,
  reporter
}) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ReportForm> | null>({
    userId,
    reportedBy: reporter,
    reportType: "Event Fraud"
  });
  
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const aspectRatio = 1;
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(`Invalid file type. Allowed types: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
      return;
    }
    if (file.size > maxSizeBytes) {
      setErrorMessage(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setErrorMessage('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
    setUploadStatus('idle');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setUploadStatus("loading")
    try {
      e.preventDefault();
      if (selectedFile) {
        const image = await uploadToCloudinary(selectedFile);
        setFormData((prev) => ({
          ...prev,
          evidence: image
        }))
      }
      const res = await axiosInstance.post("/admin/report", formData);
      if (res.data) {
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setUploadStatus("success");
      setFormData({
        userId,
        reportedBy: reporter,
        reportType: "Event Fraud"
      });
      setSelectedFile(null);
      setPreview(null);
      onClose();
    }
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className="absolute inset-0 bg-black/80 bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-md relative transition-all duration-300 transform ${animateIn ? "scale-100 translate-y-0" : "scale-95 -translate-y-4"
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            Report user
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div className="flex flex-col gap-5 w-full">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name='reportType'
                  value={formData?.reportType || "Event Fraud"}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Event Fraud">Event Fraud</option>
                  <option value="Abuse">Abuse</option>
                  <option value="Spam">Spam</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Fake Profile">Fake Profile</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData?.description || ''}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="evidence"
              >
                Evidence
              </label>
              {!preview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    id='evidence'
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={allowedTypes.join(',')}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-blue-50 rounded-full">
                      <Upload size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Drop your image here, or <span className="text-blue-500">browse</span></p>
                      <p className="text-gray-500 text-sm mt-1">
                        Supports: {allowedTypes.map(type => type.split('/')[1]).join(', ')} (Max {maxSizeMB}MB)
                      </p>
                      {aspectRatio && (
                        <p className="text-gray-500 text-sm mt-1">Recommended aspect ratio: {aspectRatio === 1 ? 'Square' : aspectRatio}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                    <button
                      onClick={() => {
                        setPreview(null);
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1 rounded-full hover:bg-opacity-80 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-md">
                        <FileImage size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                          {selectedFile?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-start space-x-2">
                  <AlertCircle size={16} className="text-red-500 mt-0.5" />
                  <span className="text-red-700 text-sm">{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-around items-center mt-5 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={!selectedFile || uploadStatus === 'loading' || uploadStatus === 'success'}
              className={`flex flex-1 px-4 py-2 justify-center rounded-md items-center transition-colors ${!selectedFile || uploadStatus === 'loading' || uploadStatus === 'success'
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                }`}
            >
              {uploadStatus === 'loading' && (
                <Loader size={16} className="mr-2 animate-spin" />
              )}
              {uploadStatus === 'success' && (
                <CheckCircle size={16} className="mr-2" />
              )}
              {uploadStatus === 'loading' ? 'Reporting...' :
                uploadStatus === 'success' ? 'Report' : 'Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
