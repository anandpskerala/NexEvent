import { useEffect, useState } from 'react'
import type { ICoupon } from '../../interfaces/entities/Coupons';
import type { RootState } from '../../store';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance';
import { CouponForm } from '../../components/forms/CouponForm';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { AdminSideBar } from '../../components/partials/AdminSideBar';

const EditCoupon = () => {
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [coupon, setCoupon] = useState<ICoupon>();

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    useEffect(() => {
        try {
            const fetchRequest = async () => {
                const res = await axiosInstance.get(`/admin/coupon/${id}`);
                if (res.data) {
                    setCoupon(res.data.coupon);
                }
            }
            fetchRequest();
        } catch (error) {
            console.error(error)
        }
    }, [id]);

    if (!coupon) return null;
    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='coupons' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Edit coupon' user={user} toggleSidebar={toggleSidebar} />
                    <CouponForm initialData={coupon} isEdit={true} />
                </div>
            </div>
        </div>
    )
}

export default EditCoupon;