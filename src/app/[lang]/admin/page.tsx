import { getAdminStats } from '@/lib/admin';
import { DollarSign, Calendar, Home, Users } from 'lucide-react';

export const metadata = {
    title: 'Admin Dashboard | Riva Chalets',
};

async function StatsCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-full ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`${stats.totalRevenue.toLocaleString()} JOD`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                />
                <StatsCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon={Calendar}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Active Chalets"
                    value={stats.activeChalets}
                    icon={Home}
                    color="bg-amber-500"
                />
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-purple-500"
                />
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Guest</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Chalet</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Dates</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recentBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{booking.guestName}</div>
                                        <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{booking.chalet.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {booking.totalPrice} JOD
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
