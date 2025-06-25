import React, { useCallback, useEffect, useState, lazy, Suspense, memo, type JSX } from "react";
import { AdminSideBar } from "../../components/partials/AdminSideBar";
import { Edit, Search, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import type { RootState } from "../../store";
import axiosInstance from "../../utils/axiosInstance";
import Pagination from "../../components/partials/Pagination";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { AdminNavbar } from "../../components/partials/AdminNavbar";
import { FormSkeleton } from "../../components/skeletons/FormSkeleton";
import type { User } from "../../interfaces/entities/User";
import { validateUser } from "../../interfaces/validators/usermanagevalidator";
import { useDebounce } from "../../hooks/useDebounce";

const UserModal = lazy(() => import("../../components/modals/UserModal"));
const DeleteConfirmationModal = lazy(() => import("../../components/modals/DeleteConfirmationModal"));

const useUserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    const fetchRequests = useCallback(
        async (pageNumber = 1, query = "", status = "", role = "") => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(
                    `/user/users?query=${query}&page=${pageNumber}&limit=10&status=${status}&role=${role}`
                );
                if (res.data) {
                    setUsers(res.data.users);
                    setPage(Number(res.data.page));
                    setPages(Number(res.data.pages));
                }
            } catch (error) {
                toast.error("Failed to fetch users. Please try again.");
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { users, page, pages, loading, fetchRequests, setPage };
};

const UserRow = memo(
    ({
        user,
        getRole,
        getStatus,
        getStatusColor,
        getStatusDot,
        onEdit,
        onDelete,
    }: {
        user: User;
        getRole: (role: string[]) => JSX.Element;
        getStatus: (user: User) => string;
        getStatusColor: (user: User) => string;
        getStatusDot: (user: User) => string;
        onEdit: (user: User) => void;
        onDelete: (user: User) => void;
    }) => (
        <tr className="border-b border-gray-200">
            <td className="p-4">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-500 text-sm">
                        {user.firstName[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium">
                            {user.firstName} {user.lastName}
                        </div>
                        <div className="text-gray-500 text-sm">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="p-4">{getRole(user.roles)}</td>
            <td className="p-4">
                <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        user
                    )}`}
                >
                    <div className={`h-2 w-2 rounded-full mr-1.5 ${getStatusDot(user)}`}></div>
                    {getStatus(user)}
                </div>
            </td>
            <td className="p-4 hidden md:table-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
            <td className="p-4">
                <div className="flex space-x-2">
                    <button
                        className="p-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
                        onClick={() => onEdit(user)}
                        aria-label={`Edit user ${user.firstName} ${user.lastName}`}
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                        onClick={() => onDelete(user)}
                        aria-label={`Delete user ${user.firstName} ${user.lastName}`}
                    >
                        <Trash size={18} />
                    </button>
                </div>
            </td>
        </tr>
    )
);

const UserManagement = () => {
    const { user: authState } = useSelector((state: RootState) => state.auth);
    const { users, page, pages, loading, fetchRequests, setPage } = useUserManagement();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [filter, setFilter] = useState({ status: "", role: "" });
    const debouncedFilter = useDebounce(filter, 500);


    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const getStatus = useCallback((user: User) => {
        if (user.isBlocked) return "Blocked";
        if (!user.isVerified) return "Pending";
        return "Active";
    }, []);

    const getStatusColor = useCallback((user: User) => {
        if (user.isBlocked) return "bg-red-100 text-red-800";
        if (!user.isVerified) return "bg-yellow-100 text-yellow-800";
        return "bg-green-100 text-green-800";
    }, []);

    const getStatusDot = useCallback((user: User) => {
        if (user.isBlocked) return "bg-red-500";
        if (!user.isVerified) return "bg-yellow-500";
        return "bg-green-500";
    }, []);

    const Badge = ({ color, text }: { color: string; text: string }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {text}
        </span>
    );

    const getRole = useCallback((role: string[]) => {
        if (role.includes("admin")) return <Badge color="bg-purple-100 text-purple-600" text="Admin" />;
        if (role.includes("organizer")) return <Badge color="bg-blue-100 text-blue-800" text="Organizer" />;
        return <Badge color="bg-green-100 text-green-600" text="User" />;
    }, []);

    const updateUser = async (user: User) => {
        try {
            await validateUser(user);
            const res = await axiosInstance.patch(`/user/${user.id}`, user);
            if (res.data) {
                toast.success(res.data.message);
                setSelectedUser(null);
                setIsModalOpen(false);
                fetchRequests(page, debouncedSearch, debouncedFilter.status, debouncedFilter.role);
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                toast.error(error.message);
            } else if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Failed to update user.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            const res = await axiosInstance.delete(`/user/${selectedUser.id}`);
            if (res.data) {
                toast.success(res.data.message);
                setSelectedUser(null);
                setConfirmModalOpen(false);
                fetchRequests(page, debouncedSearch, debouncedFilter.status, debouncedFilter.role);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Failed to delete user.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilter = (name: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter((prev) => ({ ...prev, [name]: e.target.value }));
    };

    useEffect(() => {
        fetchRequests(page, debouncedSearch, debouncedFilter.status, debouncedFilter.role);
    }, [debouncedSearch, page, debouncedFilter, fetchRequests]);

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarOpen} section="users" />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title="Users" user={authState} toggleSidebar={toggleSidebar} />
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search users by name or email"
                                className="w-full md:w-80 pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                aria-label="Search users by name or email"
                            />
                            <button
                                className="absolute right-0 top-0 h-full px-3 text-white bg-blue-600 rounded-r-lg"
                                aria-label="Search"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="border rounded-lg px-3 py-2 text-sm"
                                onChange={(e) => handleFilter("status", e)}
                                value={filter.status}
                                aria-label="Filter by status"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                                <option value="pending">Pending</option>
                            </select>
                            <select
                                className="border rounded-lg px-3 py-2 text-sm"
                                onChange={(e) => handleFilter("role", e)}
                                value={filter.role}
                                aria-label="Filter by role"
                            >
                                <option value="">All Roles</option>
                                <option value="user">User</option>
                                <option value="organizer">Organizer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow overflow-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr className="border-b">
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">User</th>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Role</th>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600 hidden sm:table-cell">
                                        Joined Date
                                    </th>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <FormSkeleton colSpan={5} />
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <UserRow
                                            key={user.id}
                                            user={user}
                                            getRole={getRole}
                                            getStatus={getStatus}
                                            getStatusColor={getStatusColor}
                                            getStatusDot={getStatusDot}
                                            onEdit={() => {
                                                setSelectedUser(user);
                                                setIsModalOpen(true);
                                            }}
                                            onDelete={() => {
                                                setSelectedUser(user);
                                                setConfirmModalOpen(true);
                                            }}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-6">
                        <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
                    </div>
                </div>
            </div>
            <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center z-50">Loading...</div>}>
                {selectedUser && (
                    <UserModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedUser(null);
                        }}
                        user={selectedUser}
                        onSave={updateUser}
                    />
                )}
                {selectedUser && (
                    <DeleteConfirmationModal
                        isOpen={isConfirmModalOpen}
                        onClose={() => {
                            setConfirmModalOpen(false);
                            setSelectedUser(null);
                        }}
                        onConfirm={handleDelete}
                        itemName={`${selectedUser.firstName} ${selectedUser.lastName}'s account`}
                    />
                )}
            </Suspense>
        </div>
    );
};

export default UserManagement;