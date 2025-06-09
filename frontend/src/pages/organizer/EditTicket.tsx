import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { OrganizerSideBar } from '../../components/partials/OrganizerSidebar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import { TicketForm } from '../../components/forms/TicketForm';


const EditTicket = () => {
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [event, setEvent] = useState();
    const [loading, setLoading] = useState<boolean>(true);

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    useEffect(() => {
        setLoading(true);
        const fetchRequest = async () => {
            try {
                const res = await axiosInstance.get(`/event/event/${id}`)
                if (res.data) {
                    setEvent(res.data.event);
                }
                console.log(res)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }
        fetchRequest();
    }, [id]);

    return (
        <div className="flex h-screen bg-gray-50">
            <OrganizerSideBar sidebarCollapsed={sidebarCollapsed} section='events' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Edit Tickets' user={user} toggleSidebar={toggleSidebar} />

                    <div className="flex w-full justify-center">
                        <div className="flex items-center mb-8">
                            <div className="flex items-center">
                                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</div>
                                <span className="ml-2 text-blue-600 font-medium text-sm">Basic Info</span>
                            </div>
                            <div className="h-px bg-blue-600 w-5 md:w-10 mx-2"></div>
                            <div className="flex items-center">
                                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</div>
                                <span className="ml-2 text-blue-600 font-medium">Tickets</span>
                            </div>
                            <div className="h-px bg-gray-300 w-5 md:w-10 mx-2"></div>
                            <div className="flex items-center">
                                <div className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">3</div>
                                <span className="ml-2 text-gray-700 font-medium">Publish</span>
                            </div>
                        </div>
                    </div>

                    {loading ? <EventFormSkeleton /> : <TicketForm initialData={event} isEdit={true} />}
                </div>
            </div>
        </div>
    )
}

export default EditTicket;