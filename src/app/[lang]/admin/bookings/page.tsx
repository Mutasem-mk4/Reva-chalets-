import { prisma } from '@/lib/db';
import { approveBooking, cancelBooking } from '@/app/actions/admin';
import { Check, X } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const metadata = {
    title: 'Manage Bookings | Riva Admin',
};

async function getAdminBookings() {
    const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true } },
            chalet: { select: { name: true } }
        }
    });
    return bookings;
}

export default async function AdminBookingsPage() {
    const bookings = await getAdminBookings();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
                <span className="text-sm text-gray-500">{bookings.length} Total Bookings</span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Guest</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Chalet</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Dates</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                                        #{booking.id.slice(-6)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{booking.guestName}</div>
                                        <div className="text-xs text-gray-500">{booking.guestEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{booking.chalet.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex flex-col">
                                            <span>In: {new Date(booking.startDate).toLocaleDateString()}</span>
                                            <span>Out: {new Date(booking.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                booking.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    'bg-red-50 text-red-700 border-red-200'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {booking.totalPrice} JOD
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {booking.status === 'PENDING' && (
                                                <form action={async () => {
                                                    'use server';
                                                    await approveBooking(booking.id);
                                                }}>
                                                    <button type="submit" className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Approve">
                                                        <Check size={16} />
                                                    </button>
                                                </form>
                                            )}
                                            {booking.status !== 'CANCELLED' && (
                                                <form action={async () => {
                                                    'use server';
                                                    await cancelBooking(booking.id);
                                                }}>
                                                    <button type="submit" className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Cancel">
                                                        <X size={16} />
                                                    </button>
                                                </form>
                                            )}
                                        </div>
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
