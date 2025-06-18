import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RevenueAnalyticsGraphPoint, TopSelling } from '../../interfaces/entities/RevenueAnalytics';
import type { RootState } from '../../store';
import axiosInstance from '../../utils/axiosInstance';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { OrganizerSideBar } from '../../components/partials/OrganizerSidebar';
import { Filter } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { formatCurrency } from '../../utils/stringUtils';

const OrganizerAnalytics = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [analytics, setAnalytics] = useState<RevenueAnalyticsGraphPoint[]>([]);
    const [topSelling, setTopSelling] = useState<TopSelling[]>([]);
    const [timeFilter, setTimeFilter] = useState('today');

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    useEffect(() => {
        const fetchAnalytics = async (mode: string) => {
            try {
                const [revenueRes, topRes] = await Promise.all([
                    axiosInstance.get(`/event/analytics/revenue?mode=${mode}&organizerId=${user?.id}`),
                    axiosInstance.get(`/event/analytics/topselling?mode=${mode}&organizerId=${user?.id}&limit=10`)
                ]);
                if (revenueRes.data) {
                    setAnalytics(revenueRes.data.report)
                }

                if (topRes.data) {
                    setTopSelling(topRes.data.report);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchAnalytics(timeFilter)
    }, [timeFilter])

    return (
        <div className="flex h-screen bg-gray-50">
            <OrganizerSideBar sidebarCollapsed={sidebarCollapsed} section='analytics' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title="Analytics" user={user} toggleSidebar={toggleSidebar} />

                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Time Period:</span>
                                </div>
                                <div className="flex gap-2">
                                    {['today', 'month', 'year'].map((period) => (
                                        <button
                                            key={period}
                                            onClick={() => setTimeFilter(period)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${timeFilter === period
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {period !== "today" && "This"} {period.charAt(0).toUpperCase() + period.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow mt-10">
                            <h2 className="text-xl font-semibold mb-5">Revenue Chart</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={analytics}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number, name: string) => {
                                        return name === "Revenue"
                                            ? formatCurrency(value, "INR")
                                            : value.toLocaleString();
                                    }} />
                                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                                    <Line type="monotone" dataKey="bookings" stroke="#82ca9d" name="Bookings" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto mt-5">
                            <h2 className="text-xl font-semibold mb-5">Top-Selling Events</h2>
                            <table className="min-w-full rounded">
                                <thead className="bg-gray-100 rounded-t-md">
                                    <tr>
                                        <th className="text-left px-4 py-2">Image</th>
                                        <th className="text-left px-4 py-2">Title</th>
                                        <th className="text-left px-4 py-2">Revenue</th>
                                        <th className="text-left px-4 py-2">Bookings</th>
                                        <th className="text-left px-4 py-2">Tickets</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topSelling.map((event) => (
                                        <tr key={event.eventId} className="border-t">
                                            <td className="px-4 py-2">
                                                <img src={event.image} alt={event.title} className="w-12 h-12 rounded object-cover" />
                                            </td>
                                            <td className="px-4 py-2 font-medium">{event.title}</td>
                                            <td className="px-4 py-2">{formatCurrency(event.totalRevenue, "INR")}</td>
                                            <td className="px-4 py-2">{event.totalBookings}</td>
                                            <td className="px-4 py-2">{event.totalTickets}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrganizerAnalytics