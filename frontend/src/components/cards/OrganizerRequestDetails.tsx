import { AlertCircle, Building, CheckCircle, Clock, FileText, Globe, User as UserIcon, LucideLoader, XCircle, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import axiosInstance from '../../utils/axiosInstance';
import type { ReqConfirmationModalProps, RequestDetailsProps } from '../../interfaces/props/modalProps';


const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    action,
    organizationName
}: ReqConfirmationModalProps) => {
    const [reason, setReason] = useState<string>("");
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/80 bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            <div className="bg-white rounded-lg shadow-xl z-10 w-96 max-w-full mx-4 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                        Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                    >
                        <XCircle size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${action === 'approve' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                            {action === 'approve' ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            )}
                        </div>
                        <div>
                            <p className="text-gray-800 font-medium">
                                Are you sure you want to {action === 'approve' ? 'approve' : 'reject'} this registration?
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                                Organization: <span className="font-medium">{organizationName}</span>
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        {action === 'approve'
                            ? "This action will grant the organizer access to create and manage events."
                            : "This action will deny the organizer's request to join the platform."}
                    </p>

                    {action === 'reject' && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for rejection (optional):
                            </label>
                            <textarea
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full border-1 border-black rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
                                rows={3}
                                placeholder="Provide feedback to the applicant..."
                            />
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-4 py-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-white cursor-pointer border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(reason.trim() !== "" ? reason : undefined)}
                        className={`border border-transparent rounded-md px-4 py-2 text-sm font-medium text-white cursor-pointer ${action === 'approve'
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-red-600 hover:bg-red-700'
                            }`}
                    >
                        {action === 'approve' ? 'Approve' : 'Reject'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const OrganizerRequestDetails: React.FC<RequestDetailsProps> = ({ user, request, onReapply, onUpdateStatus }) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');

    const handleConfirm = async (reason?: string) => {
        try {
            const action = modalAction === 'approve' ? 'accepted' : 'rejected';
            const res = await axiosInstance.patch(`/organizer/request/${request.userId}`, {
                action,
                rejectionReason: reason
            });
            if (res.data) {
                toast.success(res.data.message);
                onUpdateStatus(
                    modalAction === 'approve' ? 'accepted' : 'rejected'
                );
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data.message);
                toast.error(error.response?.data.message)
            }
        }
        setIsModalOpen(false);
    };

    const formatDate = (dateString: string) => {
        if (!dateString || isNaN(new Date(dateString).getTime())) {
            return 'Invalid date';
        }
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                        <Clock size={16} />
                        <span className="font-medium">Pending</span>
                    </div>
                );
            case 'accepted':
                return (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle size={16} />
                        <span className="font-medium">Accepted</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        <AlertCircle size={16} />
                        <span className="font-medium">Rejected</span>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleActionClick = (action: 'approve' | 'reject') => {
        setModalAction(action);
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-8 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Organizer Request</h1>
                        <p className="text-gray-500 text-md mt-1">Submitted on {formatDate(request.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {getStatusBadge(request.status)}

                    </div>
                </div>
                <div className="px-0 py-6 md:px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Building className="text-gray-500" size={20} />
                        <h2 className="text-lg font-medium text-gray-900">Organization Details</h2>
                    </div>
                    <div className="ml-7">
                        <p className="text-gray-800 font-medium text-lg mb-1">{request.organization}</p>

                        {request.website && (
                            <a
                                href={request.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline mt-2"
                            >
                                <Globe size={16} />
                                {request.website}
                            </a>
                        )}
                    </div>
                </div>

                <div className="px-0 md:p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <UserIcon className="text-gray-500" size={20} />
                        <h2 className="text-lg font-medium text-gray-900">User Information</h2>
                    </div>
                    <div className="ml-7">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm">User ID</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono text-sm mt-1">
                                {typeof request.userId === 'string' ? request.userId : request.userId.id}
                            </code>
                        </div>
                    </div>
                </div>

                <div className="px-0 md:p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText className="text-gray-500" size={20} />
                        <h2 className="text-lg font-medium text-gray-900">Request Description</h2>
                    </div>
                    <div className="ml-7">
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                            <p className="text-gray-800 whitespace-pre-wrap">
                                {expanded || request.reason.length < 300
                                    ? request.reason
                                    : `${request.reason.substring(0, 300)}...`}
                            </p>
                            {request.reason.length > 300 && (
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="text-blue-600 text-sm mt-2 hover:underline"
                                >
                                    {expanded ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {
                    user?.roles.includes("admin") && (
                        <div className="px-4 sm:px-6 md:px-8 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="text-gray-500" size={20} />
                                <h2 className="text-lg font-medium text-gray-900">Verification Documents</h2>
                            </div>
                            <div className="w-full mx-auto">
                                <img src={request.documents} alt="Verification document" className="w-full h-auto rounded shadow-sm mt-10" />
                            </div>
                        </div>
                    )
                }

                {request.status === 'rejected' && request.rejectionReason && (
                    <div className="px-0 md:p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-red-500" size={20} />
                            <h2 className="text-lg font-medium text-red-600">Rejection Reason</h2>
                        </div>
                        <div className="ml-7">
                            <div className="bg-red-50 p-4 rounded-md border border-red-200">
                                <p className="text-gray-800 whitespace-pre-wrap">{request.rejectionReason}</p>
                            </div>
                        </div>

                        {(
                            (typeof request.userId === 'object' && request.userId?.id === user?.id && onReapply) ||
                            (typeof request.userId === 'string' && request.userId === user?.id && onReapply)
                        ) && (
                                <button
                                    className="ml-7 mt-15 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer flex items-center gap-2"
                                    onClick={onReapply}
                                >
                                    <LucideLoader size={16} />
                                    Re-Apply
                                </button>
                            )}
                    </div>
                )}

                {(user?.roles.includes("admin") && !onReapply && request.status === "pending") && (
                    <div className="flex gap-2 mt-10 px-0 md:px-5">
                        <button
                            onClick={() => handleActionClick('approve')}
                            className="bg-indigo-600 text-white text-sm cursor-pointer py-2 px-4 rounded flex-1 hover:bg-indigo-700 flex items-center justify-center gap-1"
                        >
                            <CheckCircle size={16} />
                            <span>Approve</span>
                        </button>
                        <button
                            onClick={() => handleActionClick('reject')}
                            className="bg-red-500 text-white text-sm py-2 px-4 cursor-pointer rounded flex-1 hover:bg-red-600 flex items-center justify-center gap-1"
                        >
                            <XCircle size={16} />
                            <span>Reject</span>
                        </button>
                    </div>
                )}
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                action={modalAction}
                organizationName={request.organization}
            />
        </div>
    )
}