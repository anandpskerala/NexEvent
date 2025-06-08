import React, { useCallback, useEffect, useState } from 'react'
import { AdminSideBar } from '../../components/partials/AdminSideBar';
import { Edit, Search, Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import type { RootState } from '../../store';
import axiosInstance from '../../utils/axiosInstance';
import Pagination from '../../components/partials/Pagination';
import UserModal from '../../components/modals/UserModal';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { FormSkeleton } from '../../components/skeletons/FormSkeleton';
import type { User } from '../../interfaces/entities/user';
import { validateUser } from '../../interfaces/validators/usermanagevalidator';
import { useDebounce } from '../../hooks/useDebounce';


const UserManagement = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isConfirmModal, setConfirmModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState({
        status: "",
        role: ""
    });

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    const getStatus = (user: User) => {
        if (user.isBlocked) {
            return 'Blocked';
        } else if (!user.isVerified) {
            return 'Pending';
        } else {
            return 'Active';
        }
    };

    const getStatusColor = (user: User) => {
        if (user.isBlocked) {
            return 'bg-red-100 text-red-800';
        } else if (!user.isVerified) {
            return 'bg-yellow-100 text-yellow-800';
        } else {
            return 'bg-green-100 text-green-800';
        }
    };

    const getStatusDot = (user: User) => {
        if (user.isBlocked) {
            return 'bg-red-500';
        } else if (!user.isVerified) {
            return 'bg-yellow-500';
        } else {
            return 'bg-green-500';
        }
    };

    const getRole = (role: string[]) => {
        if (role.includes("admin")) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Admin</span>;
        } else if (role.includes("organizer")) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Organizer</span>;
        } else {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">User</span>;
        }
    }

    const updateUser = async (user: User) => {
        try {
            await validateUser(user)
            const res = await axiosInstance.patch(`/user/${user.id}`, user);
            if (res.data) {
                toast.success(res.data.message);
                setSelectedUser(null)
            }
        } catch (error) {
            console.log(error)
            if (error instanceof Yup.ValidationError) {
                toast.error(error.message);
            } else if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Unknown error occurred.");
            }
        }
    };

    const handleDelete = async () => {
        try {
            const res = await axiosInstance.delete(`/user/${selectedUser?.id}`);
            if (res.data) {
                toast.success(res.data.message);
                setSelectedUser(null)
                setConfirmModal(false);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Unknown error occurred.");
            }
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleFilter = (name: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter((prev) => ({
            ...prev,
            [name]: e.target.value
        }))
    }

    const fetchRequests = useCallback(async (pageNumber = 1, query = "") => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/user/users?query=${query}&page=${pageNumber}&limit=10&status=${filter.status}&role=${filter.role}`);
            if (res.data) {
                setUsers(res.data.users);
                setPage(res.data.page);
                setPages(res.data.pages);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    }, [filter])

    useEffect(() => {
        fetchRequests(1, debouncedSearch)
    }, [debouncedSearch, fetchRequests]);

    useEffect(() => {
        fetchRequests(page);
    }, [fetchRequests, page, selectedUser])

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='users' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Users' user={user} toggleSidebar={toggleSidebar} />

                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search users by name or email"
                                className="w-full md:w-80 pl-3 pr-10 py-2 border rounded"
                            />
                            <button className="absolute right-0 top-0 h-full px-3 text-white bg-blue-800 rounded-r">
                                <Search size={20} />
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <select className="border rounded px-3 py-2 text-sm" onChange={(e) => handleFilter("status", e)}>
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                            </select>
                            <select className="border rounded px-3 py-2 text-sm" onChange={(e) => handleFilter("role", e)}>
                                <option>All Roles</option>
                                <option value="user">User</option>
                                <option value="organizer">Organizer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-200">
                                <tr className="border-b">
                                    <th className="text-left p-4">User</th>
                                    <th className="text-left p-4">Role</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4 hidden md:table-cell">Joined Date</th>
                                    <th className="text-left p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? <FormSkeleton colSpan={5} /> : users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-300">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-500 text-sm">
                                                    {user.firstName[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                                                    <div className="text-gray-500 text-sm">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">{getRole(user.roles)}</td>
                                        <td className="p-4">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user)}`}>
                                                <div className={`h-2 w-2 rounded-full mr-1.5 ${getStatusDot(user)}`}></div>
                                                {getStatus(user)}
                                            </div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="p-1 rounded bg-blue-100 text-blue-600 cursor-pointer"
                                                    onClick={() => {
                                                        setIsModalOpen(true);
                                                        setSelectedUser(user);
                                                    }}
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="p-1 rounded bg-red-100 text-red-600 cursor-pointer"
                                                    onClick={() => {
                                                        setConfirmModal(true);
                                                        setSelectedUser(user);
                                                    }}
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={page}
                            totalPages={pages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </div>
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser as User}
                onSave={updateUser}
            />

            <DeleteConfirmationModal
                isOpen={isConfirmModal}
                onClose={() => setConfirmModal(false)}
                onConfirm={handleDelete}
                itemName={`${selectedUser?.firstName}'s account`}
            />
        </div>
    )
}

export default UserManagement;