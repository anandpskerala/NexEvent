import { X, AlertTriangle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { DeleteConfirmationModalProps } from '../../interfaces/props/modalProps';


export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setAnimateIn(true), 10);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen]);
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${animateIn ? 'opacity-100': 'opacity-0'}`}>
            <div
                className="absolute inset-0 bg-black/80 bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            <div className="bg-white rounded-lg shadow-xl z-10 w-96 max-w-full mx-4 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>


                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-gray-800 font-medium">Are you sure you want to delete this item?</p>
                            {itemName && (
                                <p className="text-gray-500 text-sm mt-1">
                                    {itemName} will be permanently removed.
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        This action cannot be undone. All associated data will be permanently deleted from our servers.
                    </p>
                </div>

                <div className="bg-gray-50 px-4 py-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="bg-red-600 border border-transparent rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};