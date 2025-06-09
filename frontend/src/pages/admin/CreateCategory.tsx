import { useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { AdminSideBar } from '../../components/partials/AdminSideBar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { CategoryForm } from '../../components/forms/CategoryForm';

const CreateCategory = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };
    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='category' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Create Category' user={user} toggleSidebar={toggleSidebar} />
                    <CategoryForm />
                </div>
            </div>
        </div>
    )
}

export default CreateCategory;