import { Mail, ExternalLink, Info, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Organization } from '../../interfaces/entities/organizer';



const StatusBadge = ({ status }: { status: Organization['status'] }) => {
    const statusConfig = {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
        accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
        rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const { bg, text, label } = statusConfig[status];

    return (
        <span className={`text-xs font-medium py-1 px-2 rounded-full ${bg} ${text}`}>
            {label}
        </span>
    );
};


const Avatar = ({ src, initials, size = 'md' }: { src?: string, initials: string, size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base'
    };

    return (
        <div className={`rounded-full flex items-center justify-center ${sizeClasses[size]} ${src ? '' : 'bg-gray-200'}`}>
            {src ? (
                <img src={src} alt={initials} className="rounded-full w-full h-full object-cover" />
            ) : (
                <span className="text-gray-600 font-medium">{initials}</span>
            )}
        </div>
    );
};


export const RegistrationCard = ({
    registration,
}: {
    registration: Organization,
    onUpdateStatus: (id: string, status: 'accepted' | 'rejected') => void
}) => {


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg">
            <div className="p-4 flex justify-between items-center border-b">
                <h3 className="font-medium text-gray-800">Organizer Registration</h3>
                <StatusBadge status={registration.status} />
            </div>


            <div className="p-4">
                <div className="flex items-center gap-3">
                    <Avatar initials={registration.userId.firstName[0]} src={registration.userId.image} />
                    <div>
                        <h4 className="font-medium text-gray-800">{registration.userId.firstName} {registration.userId.lastName}</h4>
                        <p className="text-xs text-gray-600">{registration.userId.email}</p>
                        <p className="text-xs text-gray-500">Submitted: {formatDate(registration.createdAt)}</p>
                    </div>
                </div>


                <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2">
                        <Building size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500">Organization</p>
                            <p className="text-sm text-gray-800 font-medium">{registration.organization}</p>
                        </div>
                    </div>

                    {registration.website && (
                        <div className="flex items-start gap-2">
                            <ExternalLink size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Website</p>
                                <a
                                    href={registration.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    {registration.website}
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-2">
                        <Info size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500">Reason for joining</p>
                            <p className="text-sm text-gray-800">{registration.reason}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border-t">
                    <div className="flex gap-2">
                        <button className="bg-gray-100 text-gray-800 text-sm py-2 px-4 rounded cursor-pointer flex-1 hover:bg-gray-200 flex items-center justify-center gap-1">
                            <Mail size={16} />
                            <span>Message Organizer</span>
                        </button>
                        <Link to={`/admin/organizer-requests/${registration.userId.id}`} className="border border-gray-300 text-gray-800 cursor-pointer text-sm py-2 px-4 rounded flex-1 hover:bg-gray-50 flex items-center justify-center gap-2">
                            <Info size={16} />
                            <span>View Details</span>
                        </Link>
                    </div>
            </div>
        </div>
    );
};