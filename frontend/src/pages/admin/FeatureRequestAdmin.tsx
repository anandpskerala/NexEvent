import React, { useState, useEffect, type JSX } from 'react';
import { Trash2, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { AdminSideBar } from '../../components/partials/AdminSideBar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import type { FeatureRequest } from '../../interfaces/entities/FeatureRequest';
import { captialize, formatDate } from '../../utils/stringUtils';
import axiosInstance from '../../utils/axiosInstance';
import Pagination from '../../components/partials/Pagination';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';

type ModalMode = 'view' | 'edit' | 'create';
type StatusType = "pending" | "accepted" | "rejected";

const FeatureRequestAdmin = () => {
    const { user: authState } = useSelector((state: RootState) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [requests, setRequests] = useState<FeatureRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<FeatureRequest[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('view');
    const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        const fetchRequest = async (page: number, limit: number) => {
            try {
                const res = await axiosInstance.get(`/admin/request?page=${page}&limit=${limit}`);
                if (res.data) {
                    setRequests(res.data.requests);
                    setPages(res.data.pages);
                    setFilteredRequests(res.data.requests)
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchRequest(page, 10);
    }, [page]);

    useEffect(() => {
        const filtered: FeatureRequest[] = requests;


        setFilteredRequests(filtered);
    }, [requests]);

    const getStatusIcon = (status: StatusType | undefined): JSX.Element | null => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'accepted': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status: StatusType | undefined): string => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string): string => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleStatusChange = (id: string | undefined, newStatus: StatusType): void => {
        if (!id) return;

        setSelectedRequest({ ...selectedRequest!, status: newStatus as StatusType })
    };

    const handleDelete = async () => {
        if (!selectedRequest) return;
        try {
            const res = await axiosInstance.delete(`/admin/request/${selectedRequest?.id}`);
            if (res.data) {
                setRequests(requests.filter((request) => request.id != selectedRequest?.id));
                setSelectedRequest(null);
                setIsModalOpen(false);
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    }

    const handleApply = async (id: string, data: FeatureRequest) => {
        try {
            await axiosInstance.patch(`/admin/request/${id}`, data);
            setRequests((prevRequests: FeatureRequest[]) =>
                prevRequests.map((req: FeatureRequest) =>
                    req.id === id
                        ? { ...req, status: data.status, updatedAt: new Date().toISOString() }
                        : req
                )
            );
            closeModal();
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const openModal = (mode: ModalMode, request: FeatureRequest | null = null): void => {
        setModalMode(mode);
        setSelectedRequest(request);
        setShowModal(true);
    };

    const closeModal = (): void => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarOpen} section="feature requests" />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title="Feature Requests" user={authState} toggleSidebar={toggleSidebar} />

                    <div className="w-full mx-auto p-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">

                            <div className="overflow-x-auto rounded-md">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredRequests.map((request: FeatureRequest) => (
                                            <tr key={request.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{request.featureTitle}</div>
                                                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                                                            {request.description}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                        {captialize(request.category)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                                                        {captialize(request.priority)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(request.status)}
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                                            {captialize(request.status as string)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {formatDate(request.createdAt as string)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => openModal('view', request)}
                                                            className="p-1 bg-blue-100 text-blue-600 hover:bg-blue-200 border border-blue-600 rounded transition-colors cursor-pointer"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 border border-red-600 transition-colors cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredRequests.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg">No feature requests found</div>
                                    <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center mt-6">
                            <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
                        </div>
                    </div>

                    {showModal && (
                        <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {modalMode === 'view' ? 'Feature Request Details' :
                                                modalMode === 'edit' ? 'Edit Feature Request' : 'Create Feature Request'}
                                        </h2>
                                        <button
                                            onClick={closeModal}
                                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {modalMode === 'view' && selectedRequest ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Feature Title</label>
                                                    <p className="text-gray-900">{selectedRequest.featureTitle}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                                                    <p className="text-gray-900">{selectedRequest.user?.firstName} {selectedRequest.user?.lastName}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                        {selectedRequest.category}
                                                    </span>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(selectedRequest.priority)}`}>
                                                        {selectedRequest.priority}
                                                    </span>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(selectedRequest.status)}
                                                        <select
                                                            value={selectedRequest.status}
                                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                                handleStatusChange(selectedRequest.id, e.target.value as StatusType)
                                                            }
                                                            className={`text-xs font-medium border rounded px-2 py-1 ${getStatusColor(selectedRequest.status)} cursor-pointer`}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="accepted">Accepted</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Created At</label>
                                                    <p className="text-gray-900">{formatDate(selectedRequest.createdAt as string)}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.description}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Use Case</label>
                                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.useCase}</p>
                                            </div>

                                            {selectedRequest.additionalInfo && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.additionalInfo}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            {modalMode === 'edit' ? 'Edit form would go here' : 'Create form would go here'}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                        onClick={() => handleApply(selectedRequest?.id as string, selectedRequest as FeatureRequest)}>
                                        {modalMode !== 'edit' ? 'Save Changes' : 'Create Request'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <DeleteConfirmationModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedRequest(null);
                        }}
                        onConfirm={handleDelete}
                        itemName={`${selectedRequest?.featureTitle} feature`}
                    />
                </div>
            </div>
        </div>
    )
};

export default FeatureRequestAdmin;