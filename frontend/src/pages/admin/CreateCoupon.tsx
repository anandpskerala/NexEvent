import { useState } from 'react'
import { AdminSideBar } from '../../components/partials/AdminSideBar'
import { AdminNavbar } from '../../components/partials/AdminNavbar'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { CouponForm } from '../../components/forms/CouponForm'

const CreateCoupon = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };
    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='coupons' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Create Coupon' user={user} toggleSidebar={toggleSidebar} />
                    <CouponForm />
                </div>
            </div>
        </div>
    )
}

export default CreateCoupon