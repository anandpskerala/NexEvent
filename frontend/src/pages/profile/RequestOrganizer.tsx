import { NavBar } from '../../components/partials/NavBar'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store';
import { UserSidebar } from '../../components/partials/UserSidebar';
import { OrganizerRequestForm } from '../../components/forms/OrganizerRequestForm'
import { OrganizerRequestDetails } from '../../components/cards/OrganizerRequestDetails';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { OrganizerData } from '../../interfaces/entities/Organizer';
import { Footer } from '../../components/partials/Footer';
import { getOrganizerRequest, reApplyRequestForOrganizer } from '../../services/profileService';


const RequestOrganizer = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [request, setRequest] = useState<OrganizerData | undefined>({
        id: "",
        userId: "",
        organization: "",
        website: "",
        reason: "",
        status: "",
        documents: "",
        rejectionReason: "",
        createdAt: ""
    });

    const handleReApply = async () => {

        const res = await reApplyRequestForOrganizer(request?.id as string);
        if (res) {
            setRequest(undefined);
            toast.success(res.message);
        }
    };

    const updateStatus = (status: 'accepted' | 'rejected') => {
        setRequest(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                status,
            };
        });
    };

    useEffect(() => {
        const fetchRequest = async () => {
            const res = await getOrganizerRequest(user?.id as string);
            if (res) {
                setRequest(res.request);
            }
        }
        fetchRequest();
    }, [user?.id])
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />
            <div className="flex justify-center items-center min-h-screen p-4 mt-15">
                <div className="flex w-full gap-2 md:gap-5 overflow-hidden p-0 md:px-10 md:py-6">
                    <UserSidebar user={user} section='profile' />
                    {request ? <OrganizerRequestDetails user={user} request={request} onReapply={handleReApply} onUpdateStatus={updateStatus} /> : <OrganizerRequestForm userId={user?.id} />}
                </div>
            </div>
            <Footer />
        </div >

    )
}

export default RequestOrganizer;