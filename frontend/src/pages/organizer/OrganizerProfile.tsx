import { useEffect, useState } from 'react';
import { Mail, Phone, Globe, Calendar, CheckCircle, XCircle, Clock, User as UserIcon, Building, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/stringUtils';
import { NavBar } from '../../components/partials/NavBar';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Footer } from '../../components/partials/Footer';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import type { User } from '../../interfaces/entities/User';
import { LazyLoadingScreen } from '../../components/partials/LazyLoadingScreen';
import { UserReportModal } from '../../components/modals/UserReportModal';

const OrganizerProfile = () => {
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    useEffect(() => {
        const fetchUser = async (id: string) => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/user/${id}`);
                if (res.data) {
                    setUserData(res.data.user);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser(id as string);
    }, [id]);

    if (!userData) {
        return null;
    }
    const { organizer } = userData;
    console.log(typeof organizer)
    if (loading) return <LazyLoadingScreen />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />
            <div className="max-w-4xl mx-auto py-24">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>

                    <div className="relative px-6 pb-6">
                        <div className="absolute -top-16 left-6">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                {userData?.image ? (
                                    <img
                                        src={userData.image}
                                        alt={`${userData.firstName} ${userData.lastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                        <UserIcon className="w-16 h-16 text-gray-500" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="absolute top-4 right-6">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(typeof organizer !== "undefined" ? organizer.status : 'pending')}`}>
                                {getStatusIcon(typeof organizer !== "undefined" ? organizer.status : 'pending')}
                                <span className="capitalize">{typeof organizer !== "undefined" ? organizer.status : 'pending'}</span>
                            </div>
                        </div>

                        <div className="pt-20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {userData?.firstName} {userData?.lastName}
                                    </h1>
                                    {userData?.isVerified && (
                                        <CheckCircle className="w-6 h-6 text-blue-500" aria-label="Verified Account" />
                                    )}
                                    {userData?.isBlocked && (
                                        <XCircle className="w-6 h-6 text-red-500" aria-label="Account Blocked" />
                                    )}
                                </div>

                                <button
                                onClick={() => setIsModalOpen(true)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-md cursor-pointer"
                                >
                                    Report
                                </button>
                            </div>

                            <p className="text-gray-600 text-lg mb-4">{typeof organizer !== "undefined" ? 'Event Organizer' : 'User'}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {formatDate(userData?.createdAt as string)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>{userData?.email}</span>
                                </div>
                                {userData?.phoneNumber && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{userData.phoneNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {
                    typeof userData.organizer !== "undefined" && (
                        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Building className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-900">Organization Details</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Organization Name</label>
                                        <p className="text-lg font-semibold text-gray-900">{organizer.organization}</p>
                                    </div>

                                    {organizer.website && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-gray-400" />
                                                <a
                                                    href={organizer.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {organizer.website}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Application Status</label>
                                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(organizer.status)}`}>
                                            {getStatusIcon(organizer.status)}
                                            <span className="capitalize">{organizer.status}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Joined On</label>
                                        <p className="text-gray-900">{formatDate(organizer.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Status</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle className={`w-5 h-5 ${userData?.isVerified ? 'text-green-500' : 'text-gray-400'}`} />
                                <span className="font-medium">Email Verified</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${userData?.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {userData?.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <XCircle className={`w-5 h-5 ${userData?.isBlocked ? 'text-red-500' : 'text-green-500'}`} />
                                <span className="font-medium">Account Status</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${userData?.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {userData?.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                        </div>
                    </div>
                </div>
                <UserReportModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                        }}
                        userId={`${id}`}
                        reporter={user?.id as string}
                    />
            </div>
            <Footer />
        </div>
    );
}

export default OrganizerProfile;