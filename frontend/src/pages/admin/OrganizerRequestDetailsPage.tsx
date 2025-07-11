import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { AdminSideBar } from '../../components/partials/AdminSideBar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { useParams } from 'react-router-dom';
import { OrganizerRequestDetails } from '../../components/forms/OrganizerRequestDetails';
import type { OrganizerData } from '../../interfaces/entities/Organizer';
import { getRequestDetails } from '../../services/organizerRequest';

const OrganizerRequestDetailsPage = () => {
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [request, setRequest] = useState<OrganizerData>({
        id: "",
        userId: "",
        organization: "",
        website: "",
        reason: "",
        status: "pending",
        documents: "",
        rejectionReason: "",
        createdAt: ""
    });

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };


    const handleUpdateStatus = (newStatus: 'accepted' | 'rejected') => {
        setRequest({ ...request, status: newStatus });
    };

    const fetchRequests = useCallback(async () => {
        const res = await getRequestDetails(id as string);
        if (res) {
            setRequest(res.request)
        }
    }, [id]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests])
    if (!request) return null;
    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='organizer requests' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Request Details' user={user} toggleSidebar={toggleSidebar} />

                    <OrganizerRequestDetails request={request} user={user} onUpdateStatus={handleUpdateStatus} />
                </div>
            </div>
        </div>
    )
}

export default OrganizerRequestDetailsPage;