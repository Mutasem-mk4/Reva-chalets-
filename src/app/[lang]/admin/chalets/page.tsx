import { prisma } from '@/lib/db';
import { toggleChaletStatus, deleteChalet, approveChalet } from '@/app/actions/admin-chalets';
import { Edit, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Manage Chalets | Riva Admin',
};

async function getAdminChalets() {
    const chalets = await prisma.chalet.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            owner: { select: { name: true, email: true } },
            _count: { select: { bookings: true } }
        }
    });
    return chalets;
}

export default async function AdminChaletsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const chalets = await getAdminChalets();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Chalets Management</h1>
                <Link
                    href={`/${lang}/chalets/new`}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                    + Add New Chalet
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chalets.map((chalet) => (
                    <div key={chalet.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="relative h-48 w-full bg-gray-100">
                            {/* Use first image or placeholder */}
                            <Image
                                src={JSON.parse(chalet.images)[0] || '/images/placeholder.jpg'}
                                alt={chalet.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${chalet.status === 'PUBLISHED' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                    }`}>
                                    {chalet.status}
                                </span>
                                {!chalet.isApproved && (
                                    <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">
                                        Pending Approval
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{chalet.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{chalet.location} • {chalet.price} JOD/night</p>

                            <div className="mt-auto flex items-center justify-between border-t pt-4">
                                <span className="text-xs text-gray-400">
                                    {chalet._count.bookings} Bookings
                                </span>

                                <div className="flex gap-2">
                                    {/* Approve Button (if pending) */}
                                    {!chalet.isApproved && (
                                        <form action={async () => {
                                            'use server';
                                            await approveChalet(chalet.id);
                                        }}>
                                            <button type="submit" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded" title="Approve">
                                                <CheckCircle size={18} />
                                            </button>
                                        </form>
                                    )}

                                    {/* Toggle Status */}
                                    <form action={async () => {
                                        'use server';
                                        await toggleChaletStatus(chalet.id, chalet.status);
                                    }}>
                                        <button type="submit" className="p-2 text-blue-600 hover:bg-blue-50 rounded" title={chalet.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}>
                                            {chalet.status === 'PUBLISHED' ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </form>

                                    {/* Delete */}
                                    <form action={async () => {
                                        'use server';
                                        if (confirm('Are you sure you want to delete this chalet?')) {
                                            await deleteChalet(chalet.id);
                                        }
                                    }}>
                                        <button type="submit" className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
