import { prisma } from '@/lib/db';
import { createCoupon, toggleCouponStatus, deleteCoupon } from '@/app/actions/admin-coupons';
import { Tag, Trash2, Power, Plus } from 'lucide-react';

export const metadata = {
    title: 'Manage Coupons | Riva Admin',
};

async function getCoupons() {
    return await prisma.discount.findMany({
        where: { type: 'PROMO' },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function AdminCouponsPage() {
    const coupons = await getCoupons();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Coupons Management</h1>
                {/* 
                    Ideally, this would open a Modal or navigate to a /new page.
                    For simplicity, we'll implement a basic form section below or assume a separate page.
                    Let's stick to a simple Server Action Form inline for quick MVP.
                */}
            </div>

            {/* Simple Create Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={18} /> Create New Coupon</h2>
                <form action={async (formData) => {
                    'use server';
                    const code = formData.get('code') as string;
                    const value = parseFloat(formData.get('value') as string);
                    const type = formData.get('type') as 'PERCENTAGE' | 'FIXED'; // Simplified

                    if (!code || !value) return;

                    await createCoupon({
                        code,
                        value,
                        type: 'PERCENTAGE' // Hardcoded for MVP simplicity, or parse from form
                    });
                }} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                        <input name="code" type="text" placeholder="e.g. SUMMER2024" className="w-full border rounded-lg p-2" required />
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage %</label>
                        <input name="value" type="number" placeholder="10" className="w-full border rounded-lg p-2" required />
                    </div>
                    <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-medium">
                        Create
                    </button>
                    {/* Hidden inputs/more fields can be added for maxUses etc */}
                </form>
            </div>

            {/* Coupons List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Code</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Discount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Usage</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} className="text-emerald-500" />
                                        {coupon.code}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                    {coupon.value}%
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {coupon.usageCount} / {coupon.maxUses || '∞'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <form action={async () => {
                                            'use server';
                                            await toggleCouponStatus(coupon.id, coupon.isActive);
                                        }}>
                                            <button type="submit" className={`p-2 rounded ${coupon.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`} title={coupon.isActive ? 'Deactivate' : 'Activate'}>
                                                <Power size={18} />
                                            </button>
                                        </form>

                                        <form action={async () => {
                                            'use server';
                                            if (confirm('Delete this coupon?')) {
                                                await deleteCoupon(coupon.id);
                                            }
                                        }}>
                                            <button type="submit" className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No coupons created yet. Create your first one above!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
