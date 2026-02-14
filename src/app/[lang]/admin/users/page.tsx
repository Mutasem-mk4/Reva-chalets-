import { prisma } from '@/lib/db';
import { User, Shield, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
    title: 'Manage Users | Riva Admin',
};

async function getAdminUsers() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { bookings: true }
            }
        }
    });
    return users;
}

export default async function AdminUsersPage() {
    const users = await getAdminUsers();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                <span className="text-sm text-gray-500">{users.length} Total Users</span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Bookings</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                                                {user.image ? (
                                                    <Image
                                                        src={user.image}
                                                        alt={user.name || 'User'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <User size={20} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name || 'Anonymous'}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.role === 'ADMIN' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                                    <Shield size={12} /> Admin
                                                </span>
                                            ) : user.role === 'HOST' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                    Host
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                                    User
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user._count.bookings} bookings
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
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
