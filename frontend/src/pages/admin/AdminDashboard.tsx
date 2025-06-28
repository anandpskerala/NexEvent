import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { AdminSideBar } from '../../components/partials/AdminSideBar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import type { TopSelling, RevenueAnalyticsGraphPoint } from '../../interfaces/entities/RevenueAnalytics';
import { Calendar, DollarSign, Filter, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/stringUtils';
import axiosInstance from '../../utils/axiosInstance';

const AdminDashboard = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [analytics, setAnalytics] = useState<RevenueAnalyticsGraphPoint[]>([]);
    const [topSelling, setTopSelling] = useState<TopSelling[]>([]);
    const [timeFilter, setTimeFilter] = useState('today');

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    const metrics = useMemo(() => {
        const totalRevenue = analytics.reduce((sum, item) => sum + item.revenue, 0);
        const totalBookings = analytics.reduce((sum, item) => sum + item.bookings, 0);

        const avgRevenuePerBooking = totalBookings > 0
            ? Math.floor(totalRevenue / totalBookings)
            : 0;

        const avgDailyRevenue = analytics.length > 0
            ? Math.floor(totalRevenue / analytics.length)
            : 0;

        const last7Days = analytics.slice(-7);
        const prev7Days = analytics.slice(-14, -7);

        const last7Revenue = last7Days.reduce((sum, item) => sum + item.revenue, 0);
        const prev7Revenue = prev7Days.reduce((sum, item) => sum + item.revenue, 0);
        const revenueGrowth = prev7Revenue > 0
            ? ((last7Revenue - prev7Revenue) / prev7Revenue) * 100
            : 0;

        return {
            totalRevenue,
            totalBookings,
            avgRevenuePerBooking,
            avgDailyRevenue,
            revenueGrowth
        };
    }, [analytics]);



    useEffect(() => {
        const fetchAnalytics = async (mode: string) => {
            try {
                const [revenueRes, topRes] = await Promise.all([
                    axiosInstance.get(`/event/analytics/revenue?mode=${mode}`),
                    axiosInstance.get(`/event/analytics/topselling?mode=${mode}&limit=10`)
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
            <AdminSideBar sidebarCollapsed={sidebarCollapsed} section='dashboard' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title="Dashboard" user={user} toggleSidebar={toggleSidebar} />

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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue, "INR")}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                        <p className="text-2xl font-bold text-gray-900">{metrics.totalBookings.toLocaleString()}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-purple-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Avg per Booking</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.avgRevenuePerBooking, "INR")}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-orange-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Daily Average</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.avgDailyRevenue, "INR")}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="w-full mx-auto">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Top Events</h1>

                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Event
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Event ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Revenue
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Bookings
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tickets
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {topSelling.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                        No events found
                                                    </td>
                                                </tr>
                                            ) : (
                                                topSelling.map((event) => (
                                                    <tr key={event.eventId} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-12 w-12">
                                                                    <img
                                                                        className="h-12 w-12 rounded-lg object-cover bg-gray-200"
                                                                        src={event.image}
                                                                        alt={event.title}
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.style.display = 'none';
                                                                            target.nextElementSibling?.classList.remove('hidden');
                                                                        }}
                                                                    />
                                                                    <div className="hidden h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                                        <span className="text-gray-400 text-xs">IMG</span>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {event.title}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500 font-mono">
                                                                {event.eventId}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-semibold text-green-600">
                                                                {formatCurrency(event.totalRevenue, "INR")}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {event.totalBookings.toLocaleString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {event.totalTickets.toLocaleString()}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-gray-500 text-center">
                                Showing {topSelling.length} events
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard