import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { ICoupon } from '../../interfaces/entities/Coupons';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { AdminSideBar } from '../../components/partials/AdminSideBar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { formatDate } from '../../utils/stringUtils';
import { useDebounce } from '../../hooks/useDebounce';

const CouponPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [coupons, setCoupons] = useState<ICoupon[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const confirmDeleteCoupon = (couponId: string) => {
        setCouponToDelete(couponId);
        setShowDeleteModal(true);
    };

    const deleteCoupon = async () => {
        if (!couponToDelete) return;
        try {
            setLoading(true);
            const res = await axiosInstance.delete(`/admin/coupon/${couponToDelete}`);
            if (res.data) {
                toast.success(res.data.message);
                fetchCoupons(page);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        } finally {
            setCouponToDelete(null);
            setShowDeleteModal(false);
            setLoading(false);
        }
    };

    const fetchCoupons = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/admin/coupons?search=${debouncedSearch}&page=${pageNumber}&limit=10`);
            if (res.data) {
                setCoupons(res.data.coupons);
                setPage(Number(res.data.page));
                setPages(Number(res.data.pages));
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pages) {
            setPage(newPage);
            fetchCoupons(newPage);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };


    useEffect(() => {
        fetchCoupons();
    }, [debouncedSearch, fetchCoupons]);

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='coupons' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title="Coupons" user={user} toggleSidebar={toggleSidebar} />
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search by name"
                                className="w-full md:w-80 pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                aria-label="Search by name"
                            />
                            <button
                                className="absolute right-0 top-0 h-full px-3 text-white bg-blue-600 rounded-r-lg"
                                aria-label="Search"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                        <Link
                            to="/admin/create-coupon"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Coupon</span>
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Coupon Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Discount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valid Period
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Min/Max Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                    <span className="ml-2">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : coupons.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                No coupons found
                                            </td>
                                        </tr>
                                    ) : (
                                        coupons.map((coupon) => (
                                            <tr key={coupon.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {coupon.couponCode}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{coupon.couponName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatCurrency(coupon.discount)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatCurrency(coupon.minAmount)} / {formatCurrency(coupon.maxAmount)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(coupon.status)}`}>
                                                        {coupon.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            to={`/admin/edit-coupon/${coupon.couponCode}`}
                                                            className="text-green-600 hover:text-green-900 p-1 rounded"
                                                            title="Edit Coupon"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => confirmDeleteCoupon(coupon.id)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            title="Delete Coupon"
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

                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === pages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing page <span className="font-medium">{page}</span> of{' '}
                                            <span className="font-medium">{pages}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            {Array.from({ length: pages }, (_, i) => i + 1)
                                                .filter(pageNum =>
                                                    pageNum === 1 ||
                                                    pageNum === pages ||
                                                    Math.abs(pageNum - page) <= 1
                                                )
                                                .map((pageNum, index, array) => (
                                                    <React.Fragment key={pageNum}>
                                                        {index > 0 && array[index - 1] !== pageNum - 1 && (
                                                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                                ...
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => handlePageChange(pageNum)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === page
                                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    </React.Fragment>
                                                ))}
                                            <button
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page === pages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3 text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <Trash2 className="h-6 w-6 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Coupon</h3>
                                    <div className="mt-2 px-7 py-3">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete this coupon? This action cannot be undone.
                                        </p>
                                    </div>
                                    <div className="items-center px-4 py-3">
                                        <button
                                            onClick={deleteCoupon}
                                            disabled={loading}
                                            className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                                        >
                                            {loading ? 'Deleting...' : 'Delete'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDeleteModal(false);
                                                setCouponToDelete(null);
                                            }}
                                            className="px-4 py-2 bg-gray-300 text-gray-900 text-base font-medium rounded-md w-24 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CouponPage;