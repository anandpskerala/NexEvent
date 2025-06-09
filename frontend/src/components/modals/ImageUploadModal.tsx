import { AlertCircle, CheckCircle, FileImage, Loader, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react'
import type { ImageUploaderModalProps, UploadStatus } from '../../interfaces/props/modalProps';


export const ImageUploadModal: React.FC<ImageUploaderModalProps> = ({
    isOpen,
    onClose,
    onUpload,
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    aspectRatio,
    title = 'Upload Image'
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

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

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setUploadStatus('loading');
            await onUpload(selectedFile);
            setUploadStatus('success');
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (error) {
            console.log(error)
            setUploadStatus('error');
            setErrorMessage('Upload failed. Please try again.');
        }
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

    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        setUploadStatus('idle');
        setErrorMessage('');
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {!preview ? (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
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

                <div className="bg-gray-50 px-4 py-3 flex justify-end border-t border-gray-200">
                    <div className="flex space-x-2">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium text-sm cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploadStatus === 'loading' || uploadStatus === 'success'}
                            className={`px-4 py-2 rounded-md font-medium text-sm flex items-center ${!selectedFile || uploadStatus === 'loading' || uploadStatus === 'success'
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
                            {uploadStatus === 'loading' ? 'Uploading...' :
                                uploadStatus === 'success' ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}