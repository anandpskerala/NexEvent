import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { ReportActions, Reports } from '../../interfaces/entities/Reports';
import { AdminSideBar } from '../../components/partials/AdminSideBar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import axiosInstance from '../../utils/axiosInstance';
import { formatDate } from '../../utils/stringUtils';
import Pagination from '../../components/partials/Pagination';
import { Eye, Trash2 } from 'lucide-react';

const UserReportsPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [reports, setReports] = useState<Reports[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Reports | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    const statusOptions = ['Pending', 'Reviewed', 'Resolved', 'Dismissed'];

    const openEditModal = (report: Reports) => {
        setSelectedReport(report);
        setNewStatus(report.status as string);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
        setNewStatus('');
    };

    const handleStatusUpdate = async () => {
        if (!selectedReport || !newStatus) return;

        setUpdating(true);
        try {
            const res = await axiosInstance.put(`/admin/report/${selectedReport.id}/status`, {
                status: newStatus
            });

            if (res.data) {
                setReports(prevReports =>
                    prevReports.map(report =>
                        report.id === selectedReport.id
                            ? { ...report, status: newStatus as ReportActions }
                            : report
                    )
                );
                closeModal();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Reviewed': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Resolved': return 'bg-green-100 text-green-800 border-green-300';
            case 'Dismissed': return 'bg-gray-100 text-gray-800 border-gray-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    useEffect(() => {
        const fetchReports = async (page: number, limit: number) => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/admin/reports?page=${page}&limit=${limit}`);
                if (res.data) {
                    setReports(res.data.reports);
                    setPage(res.data.page);
                    setPages(res.data.pages);
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }

        fetchReports(page, 10)
    }, [page])

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='reports' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title="Reports" user={user} toggleSidebar={toggleSidebar} />

                    <div className="w-full mx-auto p-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="overflow-x-auto rounded-md">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Report Type</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 text-center">
                                                    <div className="flex justify-center items-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                        <span className="ml-2">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : reports.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                    No Reports found
                                                </td>
                                            </tr>
                                        ) : (reports.map((report) => (
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {report.userId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {report.reportType}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {report.reportedBy}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`p-1 text-sm font-medium text-gray-900 text-center rounded-2xl ${getStatusColor(report.status as string)}`}>
                                                        {report.status}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatDate(report.createdAt as string)}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(report)}
                                                            className="p-1 bg-blue-100 text-blue-600 hover:bg-blue-200 border border-blue-600 rounded transition-colors cursor-pointer"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 border border-red-600 transition-colors cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Edit Report Status
                        </h2>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                Report ID: <span className="font-medium">{selectedReport?.id}</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                Report Type: <span className="font-medium">{selectedReport?.reportType}</span>
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                disabled={updating}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={updating || newStatus === selectedReport?.status}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserReportsPage