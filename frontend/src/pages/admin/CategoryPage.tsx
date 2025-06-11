import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { AdminSideBar } from '../../components/partials/AdminSideBar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { Link } from 'react-router-dom';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { getRandomBgColor } from '../../utils/randomColor';
import axiosInstance from '../../utils/axiosInstance';
import Pagination from '../../components/partials/Pagination';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { Category } from '../../interfaces/entities/category';
import { useDebounce } from '../../hooks/useDebounce';


const CategoryPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    console.log(page, pages)

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const confirmDeleteCategory = (categoryId: string) => {
        setCategoryToDelete(categoryId);
    };

    const deleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            const res = await axiosInstance.delete(`/admin/category/${categoryToDelete}`);
            if (res.data) {
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        } finally {
            setCategoryToDelete(null);
        }
    };

    useEffect(() => {
        try {
            const fetchRequest = async (pageNumber = 1) => {
                const res = await axiosInstance.get(`/admin/categories?search=${debouncedSearch}&page=${pageNumber}&limit=10`)
                if (res.data) {
                    setCategories(res.data.categories);
                    setPage(Number(res.data.page));
                    setPages(Number(res.data.pages));
                }
                console.log(res)
            }
            fetchRequest();
        } catch (error) {
            console.error(error)
        }
    }, [categoryToDelete, debouncedSearch])

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='category' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title="Categories" user={user} toggleSidebar={toggleSidebar} />
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
                            to="/admin/create-category"
                            className="flex flex-row gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            <Plus />
                            <span>Create Category</span>
                        </Link>
                    </div>

                    <div className="p-6 bg-white w-full mx-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-100">
                                    <th className="pb-4 font-medium text-gray-700">Category Name</th>
                                    <th className="pb-4 font-medium text-gray-700 text-right">Added</th>
                                    <th className="pb-4 font-medium text-gray-700 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                                No Category found
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr key={category.id} className="border-b border-gray-50">
                                                <td className="py-4">
                                                    <div className="flex items-center">
                                                        <div className={`w-12 h-12 p-1 rounded-lg ${getRandomBgColor()} flex items-center justify-center mr-3`}>
                                                            <img src={category.image} />
                                                        </div>
                                                        <span className="font-medium text-gray-800">{category.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-gray-500 text-right">{new Date(category.createdAt).toLocaleDateString()}</td>
                                                <td className="py-4">
                                                    <div className="flex justify-end gap-1">
                                                        <Link to={`/admin/edit-category/${category.id}`} className="w-8 h-8 rounded border border-blue-200 bg-blue-50 flex items-center justify-center" title="Edit">
                                                            <Edit size={16} className="text-blue-500" />
                                                        </Link>
                                                        <button
                                                            className="w-8 h-8 rounded border border-red-200 bg-red-50 flex items-center justify-center cursor-pointer" title="Delete"
                                                            onClick={() => confirmDeleteCategory(category.id)}
                                                        >
                                                            <Trash size={16} className="text-red-500" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {categoryToDelete && (
                    <div className="fixed inset-0 bg-black/80 bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
                            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setCategoryToDelete(null)}
                                    className="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteCategory()}
                                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={pages}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </div>
    )
}

export default CategoryPage;