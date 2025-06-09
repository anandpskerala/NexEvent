import { useEffect, useState } from 'react'
import { AdminSideBar } from '../../components/partials/AdminSideBar';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { AlertTriangle } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import Pagination from '../../components/partials/Pagination';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import type { Organization } from '../../interfaces/entities/organizer';
import { RegistrationCard } from '../../components/cards/RegistrationCard';

const OrganizerRequests = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [registrations, setRegistrations] = useState<Organization[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    const handleUpdateStatus = (userId: string, newStatus: 'accepted' | 'rejected') => {
        setRegistrations(registrations.map(reg =>
            typeof reg.userId == "string" && reg.userId === userId
                ? { ...reg, status: newStatus, updatedAt: new Date().toISOString() }
                : reg
        ));
    };

    const fetchRequests = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const limit = 10;
            const res = await axiosInstance.get(`/user/requests?page=${pageNumber}&limit=${limit}`);
            if (res.data) {
                setRegistrations(res.data.requests);
                setPage(res.data.page);
                setPages(res.data.pages);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRequests();
    }, [])

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='organizer requests' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Organizer requests' user={user} toggleSidebar={toggleSidebar} />

                    {loading ? <EventFormSkeleton /> : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {registrations.map((registration, i) => (
                                    <RegistrationCard
                                        key={typeof registration.userId == "string"? registration.userId: i}
                                        registration={registration}
                                        onUpdateStatus={handleUpdateStatus}
                                    />
                                ))}

                                {registrations.length === 0 && (
                                    <div className="col-span-full  p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-500">
                                        <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-red-500" />
                                        <h3 className="text-gray-700 font-medium">No registrations found</h3>
                                        <p className="text-gray-500 mt-1">
                                            There are no requests to display
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center mt-6">
                                <Pagination
                                    currentPage={page}
                                    totalPages={pages}
                                    onPageChange={setPage}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrganizerRequests;