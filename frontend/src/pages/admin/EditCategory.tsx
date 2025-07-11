import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { AdminSideBar } from '../../components/partials/AdminSideBar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { CategoryForm } from '../../components/forms/CategoryForm';
import { useParams } from 'react-router-dom';
import type { Category } from '../../interfaces/entities/Category';
import { getCategoryDetails } from '../../services/categoryService';


const EditCategory = () => {
    const {id} = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [category, setCategory] = useState<Category>();


    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    useEffect(() => {
        try {
            const fetchRequest = async () => {
                const res = await getCategoryDetails(id as string)
                if (res) {
                    setCategory(res.category);
                }
            }
            fetchRequest();
        } catch (error) {
            console.error(error)
        }
    }, [id]);

    if (!category) return null;

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='category' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Create Category' user={user} toggleSidebar={toggleSidebar} />
                    <CategoryForm initialData={category} isEditMode={true}/>
                </div>
            </div>
        </div>
    )
}

export default EditCategory;